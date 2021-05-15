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
  AccountConfirmationStatus,
  AnonymousUser,
  AuthenticationStatus,
  isEmailAnonymous,
  isUserAnonymous,
  RegistrationRequest,
  RegistrationStatus,
  Token,
  UserStatus,
} from '@abc-map/shared-entities';
import { Config } from '../config/Config';
import { UserService } from '../users/UserService';
import * as uuid from 'uuid-random';
import * as crypto from 'crypto';
import { SmtpClient } from '../utils/SmtpClient';
import { AbstractService } from '../services/AbstractService';
import { MongoError } from 'mongodb';
import { ErrorCodes } from '../mongodb/ErrorCodes';
import { Logger } from '../utils/Logger';

const logger = Logger.get('AuthenticationService');

export interface Authentication {
  status: AuthenticationStatus;
  user?: AbcUser;
}

export class AuthenticationService extends AbstractService {
  public static create(config: Config, userService: UserService): AuthenticationService {
    const hasher = new PasswordHasher(config);
    const smtp = new SmtpClient(config);
    return new AuthenticationService(config, userService, hasher, smtp);
  }

  constructor(private config: Config, private userService: UserService, private hasher: PasswordHasher, private smtp: SmtpClient) {
    super();
  }

  public async register(request: RegistrationRequest, sendMail = true): Promise<RegistrationStatus> {
    if (isEmailAnonymous(request.email)) {
      return RegistrationStatus.EmailAlreadyExists;
    }

    const user: AbcUser = {
      id: uuid(),
      email: request.email,
      password: '',
      enabled: false,
    };
    user.password = await this.hasher.hashPassword(request.password.trim(), user.id);

    try {
      await this.userService.save(user);
    } catch (err) {
      if (err instanceof MongoError && err.code === ErrorCodes.DUPLICATE_KEY) {
        return RegistrationStatus.EmailAlreadyExists;
      }
      return Promise.reject(err);
    }

    if (sendMail) {
      const hmac = crypto.createHmac('sha512', this.config.registration.confirmationSalt);
      const secret = hmac.update(user.id).digest('hex');
      const subject = 'Activation de votre compte Abc-Map';
      const href = `${this.config.externalUrl}/confirm-account/${user.id}?secret=${secret}`;
      /* eslint-disable max-len */
      const content = `
        <p>Bonjour !</p>
        <p><a>Pour activer votre compte Abc-Map, veuillez <a href="${href}" data-cy="enable-account-link">cliquer sur ce lien.</a></p>
        <p>A bientôt !</p>
        <p>&nbsp;</p>
        <small>Ceci est un message automatique, envoyé par la plateforme <a href="${this.config.externalUrl}">${this.config.externalUrl}</a>.
        Vous ne pouvez pas répondre à ce message.</small>
      `;
      /* eslint-enable max-len */

      await this.smtp.sendMail(user.email, subject, content);
    }
    return RegistrationStatus.Successful;
  }

  public async confirmAccount(userId: string, secret: string): Promise<AccountConfirmationStatus> {
    const user = await this.userService.findById(userId);
    if (!user) {
      return AccountConfirmationStatus.UserNotFound;
    }

    const hmac = crypto.createHmac('sha512', this.config.registration.confirmationSalt);
    const truth = hmac.update(user.id).digest('hex');
    const secretIsValid = truth === secret;
    if (secretIsValid) {
      user.enabled = true;
      await this.userService.save(user);
      return AccountConfirmationStatus.Succeed;
    } else {
      return AccountConfirmationStatus.Failed;
    }
  }

  public async authenticate(email: string, password: string): Promise<Authentication> {
    if (isEmailAnonymous(email)) {
      return {
        status: AuthenticationStatus.Successful,
        user: {
          ...AnonymousUser,
          id: uuid(), // Event anonymous users must be uniques for rate limits
        },
      };
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        status: AuthenticationStatus.Refused,
      };
    }

    if (!user.enabled) {
      return {
        status: AuthenticationStatus.DisabledUser,
      };
    }

    const cleanPassword = password.trim();
    const passwordIsCorrect = await this.hasher.verifyPassword(cleanPassword, user.id, user.password);
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

  public signToken(user: AbcUser): string {
    if (!user.enabled) {
      throw new Error('User is disabled');
    }

    const safeUser: AbcUser = {
      ...user,
      password: '<password-was-erased>',
    };

    const payload: Token = {
      userStatus: isUserAnonymous(user) ? UserStatus.Anonymous : UserStatus.Authenticated,
      user: safeUser,
    };

    return jwt.sign(payload, this.config.authentication.jwtSecret, {
      algorithm: this.config.authentication.jwtAlgorithm,
      expiresIn: this.config.authentication.jwtExpiresIn,
    });
  }

  public verifyToken(token: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      jwt.verify(token, this.config.authentication.jwtSecret, (err) => {
        if (err) {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
}
