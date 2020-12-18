import * as express from 'express';
import { Controller } from './Controller';
import { Logger } from '../utils/Logger';
import { Router } from 'express';
import * as passportJWT from 'passport-jwt';
import * as passport from 'passport';
import { Token } from '@abc-map/shared-entities';
import { Services } from '../services/services';
import { Config } from '../config/Config';

const logger = Logger.get('HttpHandlers.ts', 'info');

export class HttpHandlers {
  constructor(private config: Config, private services: Services, private publicControllers: Controller[], private privateControllers: Controller[]) {}

  public getRouter(): Router {
    const app = express();
    app.use(passport.initialize());

    this.publicControllers.forEach((ctr) => {
      app.use(ctr.getRoot(), ctr.getRouter());
    });

    this.setupAuthentication(app);

    this.privateControllers.forEach((ctr) => {
      app.use(ctr.getRoot(), ctr.getRouter());
    });

    return app;
  }

  private setupAuthentication(app: Router) {
    const JWTStrategy = passportJWT.Strategy;
    const ExtractJWT = passportJWT.ExtractJwt;

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

    app.use(passport.authenticate('jwt', { session: false }));
  }
}
