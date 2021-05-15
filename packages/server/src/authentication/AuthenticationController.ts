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
  AccountConfirmationStatus,
  AuthenticationRequest,
  AuthenticationResponse,
  AuthenticationStatus,
  RegistrationRequest,
  RegistrationResponse,
  RegistrationStatus,
  RenewResponse,
  isEmailAnonymous,
} from '@abc-map/shared-entities';
import { Logger } from '../utils/Logger';
import { Authentication } from './Authentication';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Config } from '../config/Config';
import { LoginRequestSchema, RegistrationConfirmationRequestSchema, RegistrationRequestSchema } from './AuthenticationController.schemas';
import { jwtPlugin } from '../server/jwtPlugin';

const logger = Logger.get('AuthenticationController.ts');

export class AuthenticationController extends Controller {
  constructor(private config: Config, private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/authentication';
  }

  /**
   * WARNING: This controller is public, authentication is not verified before
   * @param app
   */
  public setup = async (app: FastifyInstance): Promise<void> => {
    jwtPlugin(this.config, app);

    app.post('/registration', { schema: RegistrationRequestSchema }, this.registration);
    app.post('/registration/confirmation', { schema: RegistrationConfirmationRequestSchema }, this.confirmRegistration);
    app.post('/login', { schema: LoginRequestSchema }, this.login);
    app.post('/renew', this.renew);
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

    const userId = req.body.userId;
    const secret = req.body.secret;

    try {
      const status = await authentication.confirmAccount(userId, secret);
      const user = await this.services.user.findById(userId);
      if (!user) {
        return Promise.reject(new Error(`User not found: ${userId}`));
      }

      const token = this.services.authentication.signToken(user);
      const payload: RegistrationConfirmationResponse = { status, token };
      reply.status(200).send(payload);

      metrics.registrationConfirmed();
    } catch (error) {
      const payload: RegistrationConfirmationResponse = {
        status: AccountConfirmationStatus.Failed,
        error: error.getMessage() || 'Error during confirmation',
      };
      reply.status(500).send(payload);

      metrics.registrationConfirmationFailed();
    }
  };

  private login = async (req: FastifyRequest<{ Body: AuthenticationRequest }>, reply: FastifyReply): Promise<void> => {
    const { metrics, authentication } = this.services;

    const request = req.body;
    const auth = await authentication.authenticate(request.email, request.password);

    if (auth.user) {
      const token = this.services.authentication.signToken(auth.user);
      const response: AuthenticationResponse = { token, status: AuthenticationStatus.Successful };

      if (isEmailAnonymous(request.email)) {
        metrics.anonymousAuthenticationSucceeded();
      } else {
        metrics.authenticationSucceeded();
      }

      return reply.status(200).send(response);
    } else {
      metrics.authenticationFailed();
      const response: AuthenticationResponse = { status: auth.status };
      return reply.status(401).send(response);
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

    const response: RenewResponse = { token: this.services.authentication.signToken(user) };
    reply.status(200).send(response);
  };
}
