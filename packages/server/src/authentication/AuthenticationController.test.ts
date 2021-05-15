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

import { Services, servicesFactory } from '../services/services';
import { ConfigLoader } from '../config/ConfigLoader';
import { HttpServer } from '../server/HttpServer';
import { assert } from 'chai';
import * as uuid from 'uuid-random';
import { disableSmtpClientLogging } from '../utils/SmtpClient';
import { TestHelper } from '../utils/TestHelper';
import * as crypto from 'crypto';
import { Config } from '../config/Config';
import { PasswordHasher } from './PasswordHasher';
import { AuthenticationRequest, RegistrationConfirmationRequest, RegistrationRequest } from '@abc-map/shared-entities';
import * as jwt from 'jsonwebtoken';

disableSmtpClientLogging();

describe('AuthenticationController', () => {
  let config: Config;
  let passwordHasher: PasswordHasher;
  let services: Services;
  let server: HttpServer;
  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;

    passwordHasher = new PasswordHasher(config);
    services = await servicesFactory(config);
    server = HttpServer.create(config, services);
    await server.initialize();
  });

  after(async () => {
    await services.shutdown();
    await server.shutdown();
  });

  describe('POST /authentication/registration', () => {
    it('should fail with invalid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/registration',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      // Assert
      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body should have required property \'email\'"}');
    });

    it('should work', async () => {
      // Act
      const payload: RegistrationRequest = {
        email: uuid() + '@abc-map.fr',
        password: 'azerty1234',
      };
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/registration',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('POST /authentication/registration/confirmation', () => {
    it('should fail with invalid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/registration/confirmation',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      // Assert
      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body should have required property \'userId\'"}');
    });

    it('should work', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.enabled = false;
      await services.user.save(user);
      const hmac = crypto.createHmac('sha512', config.registration.confirmationSalt);
      const secret = hmac.update(user.id).digest('hex');

      // Act
      const payload: RegistrationConfirmationRequest = {
        userId: user.id,
        secret,
      };
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/registration/confirmation',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('POST /authentication/login', () => {
    it('should fail with invalid request', async () => {
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/login',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body should have required property \'email\'"}');
    });

    it('should work with correct password', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.enabled = true;
      user.password = await passwordHasher.hashPassword('azerty1234', user.id);
      await services.user.save(user);

      // Act
      const payload: AuthenticationRequest = {
        email: user.email,
        password: 'azerty1234',
      };
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/login',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });

    it('should fail with bad password', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.enabled = true;
      user.password = await passwordHasher.hashPassword('azerty1234', user.id);
      await services.user.save(user);

      // Act
      const payload: AuthenticationRequest = {
        email: user.email,
        password: 'not the password !',
      };
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/login',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 401);
    });
  });

  describe('POST /authentication/renew', () => {
    it('should fail without authentication', async () => {
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/renew',
      });

      assert.equal(response.statusCode, 403);
      assert.equal(response.body, '{"statusCode":403,"error":"Forbidden","message":"Forbidden"}');
    });

    it('should fail with invalid authentication', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      await services.user.save(user);
      const token = jwt.sign({}, 'bad secret', {
        algorithm: config.authentication.jwtAlgorithm,
        expiresIn: config.authentication.jwtExpiresIn,
      });

      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/renew',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      assert.equal(response.statusCode, 403);
    });

    it('should work with valid authentication', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      await services.user.save(user);
      const token = services.authentication.signToken(user);

      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/renew',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });
});
