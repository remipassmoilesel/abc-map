import * as jwt from 'jsonwebtoken';
import * as express from 'express';
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
import * as passportLocal from 'passport-local';
import * as passport from 'passport';
import { Logger } from '../utils/Logger';
import * as passportJWT from 'passport-jwt';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;

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

  public initAuthentication(router: express.Router): void {
    router.use(passport.initialize());

    passport.use(
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
          secretOrKey: this.config.authentication.jwtSecret,
          jsonWebTokenOptions: {
            algorithms: [this.config.authentication.jwtAlgorithm],
          },
        },
        // Token check is done before this method, see: https://github.com/mikenicholson/passport-jwt
        (jwtPayload: Token, done) => done(null, jwtPayload.user)
      )
    );

    passport.use(
      new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
        this.authenticate(email, password)
          .then((result) => {
            if (AuthenticationStatus.Successful === result.status) {
              return done(null, result.user);
            } else {
              return done(null, result.user, { message: result.status });
            }
          })
          .catch((err) => {
            logger.error('Error while authenticating user: ', err);
            return done(err, false);
          });
      })
    );
  }

  public authenticationMiddleware(router: express.Router): void {
    router.use(passport.authenticate('jwt', { session: false }));
  }
}
