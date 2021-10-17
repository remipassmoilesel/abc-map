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

import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import {
  RegistrationConfirmationRequest,
  RegistrationConfirmationResponse,
  AuthenticationRequest,
  AuthenticationResponse,
  AuthenticationStatus,
  RegistrationRequest,
  RegistrationResponse,
  RegistrationStatus,
  RenewResponse,
  isEmailAnonymous,
  PasswordLostRequest,
  ResetPasswordRequest,
  ConfirmationStatus,
  UpdatePasswordRequest,
  DeleteAccountRequest,
} from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import { Authentication } from './Authentication';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Config } from '../config/Config';
import {
  DeleteAccountSchema,
  LoginRequestSchema,
  PasswordLostRequestSchema,
  RegistrationConfirmationRequestSchema,
  RegistrationRequestSchema,
  ResetPasswordSchema,
  UpdatePasswordRequestSchema,
} from './AuthenticationController.schemas';
import { jwtPlugin } from '../server/jwtPlugin';

const logger = Logger.get('AuthenticationController.ts');

export class AuthenticationController extends Controller {
  constructor(private config: Config, private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/authentication';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    // WARNING: This controller is public, authentication is not verified before
    jwtPlugin(this.config, app);

    // We limit usage of these routes in order to prevent bruteforce
    // FIXME We should use responses (200, 403, 401) to alter limits and ban for a larger period brute-forcers
    const authRateLimit = {
      config: { rateLimit: { max: this.config.server.authenticationRateLimit.max, timeWindow: this.config.server.authenticationRateLimit.timeWindow } },
    };

    app.post('/', { schema: LoginRequestSchema, ...authRateLimit }, this.login);
    app.delete('/', { schema: DeleteAccountSchema, ...authRateLimit }, this.deleteAccount);
    app.patch('/password', { schema: UpdatePasswordRequestSchema, ...authRateLimit }, this.updatePassword);
    app.post('/password', { schema: ResetPasswordSchema, ...authRateLimit }, this.resetPassword);
    app.post('/password/reset-email', { schema: PasswordLostRequestSchema, ...authRateLimit }, this.passwordResetEmail);
    app.post('/account', { schema: RegistrationRequestSchema, ...authRateLimit }, this.registration);
    app.post('/account/confirmation', { schema: RegistrationConfirmationRequestSchema, ...authRateLimit }, this.confirmRegistration);
    app.get('/token', { ...authRateLimit }, this.renew);
  };

  private registration = async (req: FastifyRequest<{ Body: RegistrationRequest }>, reply: FastifyReply): Promise<void> => {
    const { metrics, authentication } = this.services;

    const status = await authentication.register(req.body);
    const response: RegistrationResponse = { status };

    if (RegistrationStatus.Successful === status) {
      void reply.status(200).send(response);
      metrics.newRegistration();
    } else if (RegistrationStatus.EmailAlreadyExists === status) {
      void reply.status(409).send(response);
    } else {
      void reply.status(500).send(response);
      metrics.registrationError();
    }
  };

  private confirmRegistration = async (req: FastifyRequest<{ Body: RegistrationConfirmationRequest }>, reply: FastifyReply): Promise<void> => {
    const { authentication, metrics } = this.services;

    // Verify token
    const tokenContent = await authentication.verifyRegistrationToken(req.body.token);
    if (!tokenContent) {
      logger.warn('Bad registration token');
      metrics.registrationConfirmationFailed();
      void reply.unauthorized();
      return;
    }

    try {
      // Confirm account then reply
      const result = await authentication.confirmRegistration(tokenContent.registrationId);

      // Email already confirmed
      if (ConfirmationStatus.AlreadyConfirmed === result) {
        const response: RegistrationConfirmationResponse = { status: ConfirmationStatus.AlreadyConfirmed };
        void reply.status(409).send(response);
        return;
      }

      // Email confirmed
      const token = authentication.signAuthenticationToken(result);
      const response: RegistrationConfirmationResponse = { status: ConfirmationStatus.Succeed, token };
      void reply.status(200).send(response);

      metrics.registrationConfirmed();
    } catch (e) {
      logger.error('Registration confirmation error: ', e);

      const response: RegistrationConfirmationResponse = { status: ConfirmationStatus.Failed };
      void reply.status(401).send(response);

      metrics.registrationConfirmationFailed();
    }
  };

  private login = async (req: FastifyRequest<{ Body: AuthenticationRequest }>, reply: FastifyReply): Promise<void> => {
    const { metrics, authentication } = this.services;

    const request = req.body;
    const auth = await authentication.authenticate(request.email, request.password);

    if (auth.user) {
      const token = this.services.authentication.signAuthenticationToken(auth.user);
      const response: AuthenticationResponse = { token, status: AuthenticationStatus.Successful };
      void reply.status(200).send(response);

      if (isEmailAnonymous(request.email)) {
        metrics.anonymousAuthenticationSucceeded();
      } else {
        metrics.authenticationSucceeded();
      }
    } else {
      const response: AuthenticationResponse = { status: auth.status };
      void reply.status(401).send(response);

      metrics.authenticationFailed();
    }
  };

  private renew = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      await req.jwtVerify();
    } catch (err) {
      void reply.forbidden();
    }

    const user = Authentication.from(req);
    if (!user) {
      void reply.forbidden();
      return;
    }

    const response: RenewResponse = { token: this.services.authentication.signAuthenticationToken(user) };
    void reply.status(200).send(response);
  };

  private updatePassword = async (req: FastifyRequest<{ Body: UpdatePasswordRequest }>, reply: FastifyReply): Promise<void> => {
    const { authentication } = this.services;

    try {
      await req.jwtVerify();
    } catch (err) {
      void reply.forbidden();
    }

    const user = Authentication.from(req);
    if (!user) {
      void reply.forbidden();
      return;
    }

    const auth = await authentication.authenticate(user.email, req.body.previousPassword);
    if (AuthenticationStatus.Refused === auth.status) {
      void reply.forbidden();
      return;
    }

    await authentication.updatePassword(user.email, req.body.newPassword);
    void reply.status(200).send();
  };

  private passwordResetEmail = async (req: FastifyRequest<{ Body: PasswordLostRequest }>, reply: FastifyReply): Promise<void> => {
    const { authentication, metrics } = this.services;

    // We must not wait here, in order to not give clues on existence of address
    authentication.passwordLost(req.body.email, req.body.lang).catch((err) => logger.error('Cannot send verification email', err));
    void reply.status(200).send();

    metrics.resetPasswordEmail();
  };

  private resetPassword = async (req: FastifyRequest<{ Body: ResetPasswordRequest }>, reply: FastifyReply): Promise<void> => {
    const { authentication, metrics } = this.services;

    const tokenContent = await authentication.verifyResetPasswordToken(req.body.token);
    if (!tokenContent) {
      void reply.unauthorized();
      return;
    }

    // Here we MUST fetch email from token
    await authentication.updatePassword(tokenContent.email, req.body.password);
    void reply.status(200).send();

    metrics.resetPassword();
  };

  private deleteAccount = async (req: FastifyRequest<{ Body: DeleteAccountRequest }>, reply: FastifyReply): Promise<void> => {
    const { authentication, project, user: userService } = this.services;

    try {
      await req.jwtVerify();
    } catch (err) {
      void reply.forbidden();
    }

    const user = Authentication.from(req);
    if (!user) {
      void reply.forbidden();
      return;
    }

    const auth = await authentication.authenticate(user.email, req.body.password);
    if (AuthenticationStatus.Refused === auth.status) {
      void reply.forbidden();
      return;
    }

    await project.deleteByUserId(user.id);
    await userService.deleteById(user.id);
    void reply.status(200).send();
  };
}
