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
import * as uuid from 'uuid';
import * as crypto from 'crypto';
import { SmtpClient } from '../utils/SmtpClient';
import { AbstractService } from '../services/AbstractService';
import { MongoError } from 'mongodb';
import { ErrorCodes } from '../mongodb/ErrorCodes';

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

  public async register(request: RegistrationRequest): Promise<RegistrationStatus> {
    if (isEmailAnonymous(request.email)) {
      return RegistrationStatus.EmailAlreadyExists;
    }

    const user: AbcUser = {
      id: uuid.v4(),
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

    const hmac = crypto.createHmac('sha512', this.config.registration.confirmationSalt);
    const secret = hmac.update(user.id).digest('hex');
    const confirmationEmail = `
      <p>Bonjour !</p>
      <a>Pour activer votre compte Abc-Map, veuillez <a href="${this.config.externalUrl}/confirm-account/${user.id}?secret=${secret}">
      cliquer sur ce lien.</a></p>
      <p>A bientôt !</p>
      <p>&nbsp;</p>
      <small>Ceci est un message automatique, envoyé par la plateforme <a href="${this.config.externalUrl}">${this.config.externalUrl}</a>.
      Vous ne pouvez pas répondre à ce message.</small>
    `;
    await this.smtp.sendMail(user.email, 'Activation de votre compte Abc-Map', confirmationEmail);
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
        user: AnonymousUser,
      };
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        status: AuthenticationStatus.UnknownUser,
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
        password: '',
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
    const safeUser: AbcUser = {
      ...user,
      password: '',
    };

    const payload: Token = {
      userStatus: isUserAnonymous(user) ? UserStatus.ANONYMOUS : UserStatus.AUTHENTICATED,
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
