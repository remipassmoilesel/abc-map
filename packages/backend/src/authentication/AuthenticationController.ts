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
  RenewResponse,
} from '@abc-map/shared-entities';
import { asyncHandler } from '../server/asyncHandler';
import * as passport from 'passport';
import { Logger } from '../utils/Logger';
import { IVerifyOptions } from 'passport-local';
import { Status } from '../server/Status';
import { Authentication } from './Authentication';

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
    app.post('/register', asyncHandler(this.register));
    app.post('/confirm-account', asyncHandler(this.confirmAccount));
    app.post('/login', this.login);

    this.services.authentication.authenticationMiddleware(app);

    app.get('/renew', this.renew);
    return app;
  }

  public register = async (req: express.Request, res: express.Response): Promise<void> => {
    const request: RegistrationRequest = req.body;
    if (!request || !request.email || !request.password) {
      return Promise.reject(new Error('Invalid request'));
    }

    const result: Status = await this.services.authentication.register(request).then((status) => ({ status: status }));
    res.status(200).json(result);
  };

  // FIXME: here we should not return http code 200 in case of error
  public confirmAccount = async (req: express.Request, res: express.Response): Promise<void> => {
    const request: AccountConfirmationRequest = req.body;
    if (!request) {
      return Promise.reject(new Error('Invalid request'));
    }

    const result: AccountConfirmationResponse = await this.services.authentication
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

    res.status(200).json(result);
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

  public renew = (req: express.Request, res: express.Response): void => {
    const user = Authentication.from(req);
    if (!user) {
      res.status(500).json({ status: 'unexpected error' });
      return;
    }

    const response: RenewResponse = { token: this.services.authentication.signToken(user) };
    res.json(response);
  };
}
