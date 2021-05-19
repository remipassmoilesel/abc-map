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
} from '@abc-map/shared-entities';
import { Logger } from '../utils/Logger';
import { Authentication } from './Authentication';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Config } from '../config/Config';
import {
  LoginRequestSchema,
  PasswordLostRequestSchema,
  RegistrationConfirmationRequestSchema,
  RegistrationRequestSchema,
  ResetPasswordSchema,
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
    // FIXME We should use responses (200, 403, 401) to alter limits and ban for a larger period
    const lowRateLimit = {
      config: { rateLimit: { max: this.config.server.authenticationRateLimit.max, timeWindow: this.config.server.authenticationRateLimit.timeWindow } },
    };

    app.post('/registration', { schema: RegistrationRequestSchema, ...lowRateLimit }, this.registration);
    app.post('/registration/confirmation', { schema: RegistrationConfirmationRequestSchema, ...lowRateLimit }, this.confirmRegistration);
    app.post('/login', { schema: LoginRequestSchema, ...lowRateLimit }, this.login);
    app.post('/renew', { ...lowRateLimit }, this.renew);
    app.post('/password', { schema: PasswordLostRequestSchema, ...lowRateLimit }, this.passwordLost);
    app.patch('/password', { schema: ResetPasswordSchema, ...lowRateLimit }, this.resetPassword);
  };

  private registration = async (req: FastifyRequest<{ Body: RegistrationRequest }>, reply: FastifyReply): Promise<void> => {
    const { metrics, authentication } = this.services;

    const status = await authentication.register(req.body);
    const response: RegistrationResponse = { status };

    if (RegistrationStatus.Successful === status) {
      reply.status(200).send(response);
      metrics.newRegistration();
    } else if (RegistrationStatus.EmailAlreadyExists === status) {
      reply.status(409).send(response);
    } else {
      reply.status(500).send(response);
      metrics.registrationError();
    }
  };

  private confirmRegistration = async (req: FastifyRequest<{ Body: RegistrationConfirmationRequest }>, reply: FastifyReply): Promise<void> => {
    const { metrics, authentication } = this.services;

    // Verify token
    const tokenContent = await authentication.verifyRegistrationToken(req.body.token);
    if (!tokenContent) {
      logger.warn('Bad registration token');
      metrics.registrationConfirmationFailed();
      reply.unauthorized();
      return;
    }

    try {
      // Confirm account then reply
      const user = await authentication.confirmRegistration(tokenContent.registrationId);
      const token = authentication.signAuthenticationToken(user);

      const response: RegistrationConfirmationResponse = { status: ConfirmationStatus.Succeed, token };
      reply.status(200).send(response);

      metrics.registrationConfirmed();
    } catch (e) {
      logger.error('Registration confirmation error: ', e);

      const response: RegistrationConfirmationResponse = { status: ConfirmationStatus.Failed };
      reply.status(401).send(response);

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
      reply.status(200).send(response);

      if (isEmailAnonymous(request.email)) {
        metrics.anonymousAuthenticationSucceeded();
      } else {
        metrics.authenticationSucceeded();
      }
    } else {
      const response: AuthenticationResponse = { status: auth.status };
      reply.status(401).send(response);

      metrics.authenticationFailed();
    }
  };

  private renew = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.forbidden();
    }

    const user = Authentication.from(req);
    if (!user) {
      reply.forbidden();
      return;
    }

    const response: RenewResponse = { token: this.services.authentication.signAuthenticationToken(user) };
    reply.status(200).send(response);
  };

  private passwordLost = async (req: FastifyRequest<{ Body: PasswordLostRequest }>, reply: FastifyReply): Promise<void> => {
    const { authentication } = this.services;

    await authentication.passwordLost(req.body.email);

    reply.status(200).send();
  };

  private resetPassword = async (req: FastifyRequest<{ Body: ResetPasswordRequest }>, reply: FastifyReply): Promise<void> => {
    const { authentication } = this.services;

    const tokenContent = await authentication.verifyResetPasswordToken(req.body.token);
    if (!tokenContent) {
      reply.unauthorized();
      return;
    }

    // Here we MUST fetch email from token
    await authentication.updatePassword(tokenContent.email, req.body.password);
    reply.status(200).send();
  };
}
