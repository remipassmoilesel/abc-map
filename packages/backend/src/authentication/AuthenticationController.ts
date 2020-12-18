import * as express from 'express';
import { NextFunction, Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import {
  AbcUser,
  AccountConfirmationRequest,
  AccountConfirmationResponse,
  AccountConfirmationStatus,
  AuthenticationResponse,
  AuthenticationStatus,
  RegistrationRequest,
  RegistrationResponse,
} from '@abc-map/shared-entities';
import { asyncHandler } from '../server/asyncHandler';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { Logger } from '../utils/Logger';
import { IVerifyOptions } from 'passport-local';

const logger = Logger.get('AuthenticationController.ts');

export class AuthenticationController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/authentication';
  }

  public getRouter(): Router {
    const app = express();
    this.setupLocalStrategy();

    app.post('/register', asyncHandler(this.register));
    app.post('/confirm-account', asyncHandler(this.confirmAccount));
    app.post('/login', this.login);
    return app;
  }

  public register = (req: express.Request): Promise<RegistrationResponse> => {
    const request: RegistrationRequest = req.body;
    if (!request || !request.email || !request.password) {
      return Promise.reject(new Error('Invalid request'));
    }

    return this.services.authentication.register(request).then((status) => ({ status: status }));
  };

  // FIXME: here we should not return http code 200 in case of error
  public confirmAccount = (req: express.Request): Promise<AccountConfirmationResponse> => {
    const request: AccountConfirmationRequest = req.body;
    if (!request) {
      return Promise.reject(new Error('Invalid request'));
    }

    return this.services.authentication
      .confirmAccount(request.userId, request.secret)
      .then(async (status) => {
        const user = await this.services.user.findById(request.userId);
        if (!user) {
          return Promise.reject(new Error(`User not found: ${request.userId}`));
        }
        const token = this.services.authentication.signToken(user);
        return { status, token };
      })
      .catch((error) => ({ status: AccountConfirmationStatus.Failed, error: error.getMessage() || 'Error during confirmation' }));
  };

  public login = (req: express.Request, res: express.Response, next: NextFunction): void => {
    passport.authenticate('local', { session: false }, (err?: Error, user?: AbcUser, info?: IVerifyOptions) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const status: AuthenticationStatus = (info?.message || AuthenticationStatus.Refused) as AuthenticationStatus;
        const response: AuthenticationResponse = { status };
        return res.status(401).json(response);
      } else {
        const token = this.services.authentication.signToken(user);
        const response: AuthenticationResponse = { token, status: AuthenticationStatus.Successful };
        return res.status(200).json(response);
      }
    })(req, res, next);
  };

  private setupLocalStrategy(): void {
    const LocalStrategy = passportLocal.Strategy;
    passport.use(
      new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
        this.services.authentication
          .authenticate(email, password)
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
}
