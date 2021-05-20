/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import * as jwt from 'jsonwebtoken';
import { PasswordHasher } from './PasswordHasher';
import {
  AbcUser,
  AnonymousUser,
  AuthenticationStatus,
  isEmailAnonymous,
  isUserAnonymous,
  RegistrationRequest,
  RegistrationStatus,
  AuthenticationToken,
  RegistrationToken,
  UserStatus,
  ResetPasswordToken,
} from '@abc-map/shared';
import { Config } from '../config/Config';
import { UserService } from '../users/UserService';
import * as uuid from 'uuid-random';
import { AbstractService } from '../services/AbstractService';
import { Logger } from '@abc-map/shared';
import { RegistrationDao } from './RegistrationDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { RegistrationDocument } from './RegistrationDocument';
import { EmailService } from '../email/EmailService';

export const logger = Logger.get('AuthenticationService');

export interface Authentication {
  status: AuthenticationStatus;
  user?: AbcUser;
}

export class AuthenticationService extends AbstractService {
  public static create(config: Config, client: MongodbClient, users: UserService, emails: EmailService): AuthenticationService {
    const hasher = new PasswordHasher(config);
    const registrations = new RegistrationDao(client);
    return new AuthenticationService(config, registrations, users, hasher, emails);
  }

  constructor(
    private config: Config,
    private registrations: RegistrationDao,
    private users: UserService,
    private hasher: PasswordHasher,
    private emails: EmailService
  ) {
    super();
  }

  public init(): Promise<void> {
    return this.registrations.init();
  }

  public async register(request: RegistrationRequest): Promise<RegistrationStatus> {
    // Anonymous email cannot be used for account
    if (isEmailAnonymous(request.email)) {
      return RegistrationStatus.EmailAlreadyExists;
    }

    // Check if email is already used
    const emailAlreadyUsed = !!(await this.users.findByEmail(request.email));
    if (emailAlreadyUsed) {
      return RegistrationStatus.EmailAlreadyExists;
    }

    // Save registration request
    const registration: RegistrationDocument = {
      _id: uuid(),
      email: request.email.toLocaleLowerCase().trim(),
      password: '',
    };
    registration.password = await this.hasher.hashPassword(request.password.trim(), registration._id);
    await this.registrations.save(registration);

    // Send confirmation mail
    const token = this.signRegistrationToken(registration._id);
    this.emails.confirmRegistration(registration.email, token).catch((err) => logger.error('Mail failure: ', err));

    return RegistrationStatus.Successful;
  }

  /**
   * Confirm user account, and return an authentication token
   * @param registrationId
   */
  public async confirmRegistration(registrationId: string): Promise<AbcUser> {
    // Get corresponding registration
    const registration = await this.registrations.findById(registrationId);
    if (!registration) {
      return Promise.reject(new Error(`Registration not found with id: ${registrationId}`));
    }

    // Save user
    const user: AbcUser = {
      id: registration._id,
      email: registration.email,
      password: registration.password,
    };
    await this.users.save(user);

    // Delete registration, we do not wait for promise
    this.registrations.deleteById(registration._id).catch((err) => logger.error('Cannot delete registration: ', err));

    return user;
  }

  public async authenticate(email: string, password: string): Promise<Authentication> {
    if (isEmailAnonymous(email) && password === AnonymousUser.password) {
      return {
        status: AuthenticationStatus.Successful,
        user: {
          ...AnonymousUser,
          id: uuid(),
        },
      };
    }

    const user = await this.users.findByEmail(email);
    if (!user) {
      return {
        status: AuthenticationStatus.Refused,
      };
    }

    const passwordIsCorrect = await this.hasher.verifyPassword(password.trim(), user.id, user.password);

    if (passwordIsCorrect) {
      const safeUser = {
        ...user,
        password: '<password-was-erased>',
      };
      return {
        status: AuthenticationStatus.Successful,
        user: safeUser,
      };
    } else {
      return {
        status: AuthenticationStatus.Refused,
      };
    }
  }

  public async passwordLost(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      logger.warn(`User not found: ${user}`);
      return;
    }

    const token = this.signResetPasswordToken(email);
    this.emails.passwordLost(email, token).catch((err) => logger.error('Mail failure: ', err));
  }

  public async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      logger.warn(`User not found: ${user}`);
      return;
    }

    user.password = await this.hasher.hashPassword(newPassword.trim(), user.id);

    await this.users.save(user);
  }

  public signAuthenticationToken(user: AbcUser): string {
    const safeUser: AbcUser = {
      ...user,
      password: '<password-was-erased>',
    };

    const payload: AuthenticationToken = {
      userStatus: isUserAnonymous(user) ? UserStatus.Anonymous : UserStatus.Authenticated,
      user: safeUser,
    };

    return jwt.sign(payload, this.config.authentication.secret, {
      algorithm: this.config.jwt.algorithm,
      expiresIn: this.config.authentication.tokenExpiresIn,
    });
  }

  public signRegistrationToken(registrationId: string): string {
    const payload: RegistrationToken = { registrationId };

    return jwt.sign(payload, this.config.registration.secret, {
      algorithm: this.config.jwt.algorithm,
      expiresIn: this.config.registration.confirmationExpiresIn,
    });
  }

  public signResetPasswordToken(email: string): string {
    const payload: ResetPasswordToken = { email };

    return jwt.sign(payload, this.config.authentication.secret, {
      algorithm: this.config.jwt.algorithm,
      expiresIn: this.config.authentication.passwordLostExpiresIn,
    });
  }

  /**
   * Return token content if token is valid or false otherwise
   * @param token
   */
  public verifyAuthenticationToken(token: string): Promise<AuthenticationToken | false> {
    return new Promise<AuthenticationToken | false>((resolve) => {
      jwt.verify(token, this.config.authentication.secret, (err, payload) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve((payload as AuthenticationToken) || false);
      });
    });
  }

  /**
   * Return token content if token is valid or false otherwise
   * @param token
   */
  public verifyRegistrationToken(token: string): Promise<RegistrationToken | false> {
    return new Promise<RegistrationToken | false>((resolve) => {
      jwt.verify(token, this.config.registration.secret, (err, payload) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve((payload as RegistrationToken) || false);
      });
    });
  }

  /**
   * Return token content if token is valid or false otherwise
   * @param token
   */
  public verifyResetPasswordToken(token: string): Promise<ResetPasswordToken | false> {
    return new Promise<ResetPasswordToken | false>((resolve) => {
      jwt.verify(token, this.config.authentication.secret, (err, payload) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve((payload as ResetPasswordToken) || false);
      });
    });
  }
}
