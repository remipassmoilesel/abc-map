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
import { disableSmtpClientLogging } from '../email/SmtpClient';
import { TestHelper } from '../utils/TestHelper';
import { Config } from '../config/Config';
import { PasswordHasher } from './PasswordHasher';
import { AnonymousUser, AuthenticationRequest, Language, RegistrationConfirmationRequest, RegistrationRequest } from '@abc-map/shared';
import * as jwt from 'jsonwebtoken';
import { RegistrationDao } from './RegistrationDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { logger } from './AuthenticationController';

logger.disable();
disableSmtpClientLogging();

describe('AuthenticationController', () => {
  let config: Config;
  let mongodbClient: MongodbClient;
  let passwordHasher: PasswordHasher;
  let registrationDao: RegistrationDao;
  let services: Services;
  let server: HttpServer;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.log.warnings = false;
    config.server.globalRateLimit.max = 100;
    config.server.globalRateLimit.timeWindow = '1min';
    config.server.authenticationRateLimit.max = 10;
    config.server.authenticationRateLimit.timeWindow = '1min';

    mongodbClient = await MongodbClient.createAndConnect(config);
    passwordHasher = new PasswordHasher(config);
    registrationDao = new RegistrationDao(mongodbClient);
    services = await servicesFactory(config);

    server = HttpServer.create(config, services);
    await server.initialize();
  });

  after(async () => {
    await mongodbClient.disconnect();
    await services.shutdown();
    await server.shutdown();
  });

  describe('POST /authentication/account', () => {
    it('should fail with invalid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/account',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      // Assert
      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body must have required property \'email\'"}');
    });

    it('should work', async () => {
      // Act
      const payload: RegistrationRequest = {
        email: uuid() + '@abc-map.fr',
        password: 'azerty1234',
        lang: Language.French,
      };
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/account',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('POST /authentication/account/confirmation', () => {
    it('should fail with invalid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/account/confirmation',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      // Assert
      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body must have required property \'token\'"}');
    });

    it('should fail with invalid token', async () => {
      // Prepare
      const registration = { _id: uuid(), email: uuid() + '@abc-map.fr', password: 'azerty1234' };
      await registrationDao.save(registration);

      const payload: RegistrationConfirmationRequest = {
        token: jwt.sign({ registrationId: registration._id }, 'wrong secret', {
          algorithm: config.jwt.algorithm,
          expiresIn: config.registration.confirmationExpiresIn,
        }),
      };

      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/account/confirmation',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 401);
    });

    it('should work', async () => {
      // Prepare
      const registration = { _id: uuid(), email: uuid() + '@abc-map.fr', password: 'azerty1234' };
      await registrationDao.save(registration);

      const payload: RegistrationConfirmationRequest = {
        token: await services.authentication.signRegistrationToken(registration._id),
      };

      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/account/confirmation',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('POST /authentication', () => {
    it('should work with existing user and correct password', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.password = await passwordHasher.hashPassword('azerty1234', user.id);
      await services.user.save(user);

      // Act
      const payload: AuthenticationRequest = {
        email: user.email,
        password: 'azerty1234',
      };
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });

    it('should work with anonymous user', async () => {
      // Act
      const payload: AuthenticationRequest = {
        email: AnonymousUser.email,
        password: AnonymousUser.password,
      };
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });

    it('should fail with invalid request', async () => {
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body must have required property \'email\'"}');
    });

    it('should fail with bad password', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.password = await passwordHasher.hashPassword('azerty1234', user.id);
      await services.user.save(user);

      // Act
      const payload: AuthenticationRequest = {
        email: user.email,
        password: 'not the password !',
      };
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication',
        payload,
      });

      // Assert
      assert.equal(response.statusCode, 401);
    });
  });

  describe('GET /authentication/token', () => {
    it('should fail without authentication', async () => {
      const response = await server.getApp().inject({
        method: 'GET',
        path: '/api/authentication/token',
      });

      assert.equal(response.statusCode, 403);
      assert.equal(response.body, '{"statusCode":403,"error":"Forbidden","message":"Forbidden"}');
    });

    it('should fail with invalid authentication', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      await services.user.save(user);
      const token = jwt.sign({}, 'bad secret', {
        algorithm: config.jwt.algorithm,
        expiresIn: config.authentication.tokenExpiresIn,
      });

      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: '/api/authentication/token',
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
      const token = services.authentication.signAuthenticationToken(user);

      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: '/api/authentication/token',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('PATCH /authentication/password', () => {
    it('should fail with bad request', async () => {
      const response = await server.getApp().inject({
        method: 'PATCH',
        path: '/api/authentication/password',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body must have required property \'previousPassword\'"}');
    });

    it('should reply 403 user is not connected', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'PATCH',
        path: '/api/authentication/password',
        payload: {
          previousPassword: 'azerty1234',
          newPassword: 'qwerty789',
        },
      });

      // Assert
      assert.equal(response.statusCode, 403);
    });

    it('should reply 403 if previous password is not correct', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      await services.user.save(user);
      const token = services.authentication.signAuthenticationToken(user);

      // Act
      const response = await server.getApp().inject({
        method: 'PATCH',
        path: '/api/authentication/password',
        headers: { Authorization: `Bearer ${token}` },
        payload: {
          previousPassword: 'azerty1234',
          newPassword: 'qwerty789',
        },
      });

      // Assert
      assert.equal(response.statusCode, 403);
    });

    it('should work', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.password = await passwordHasher.hashPassword('azerty1234', user.id);
      await services.user.save(user);
      const token = services.authentication.signAuthenticationToken(user);

      // Act
      const response = await server.getApp().inject({
        method: 'PATCH',
        path: '/api/authentication/password',
        headers: { Authorization: `Bearer ${token}` },
        payload: {
          previousPassword: 'azerty1234',
          newPassword: 'qwerty789',
        },
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('POST /authentication/password', () => {
    it('should fail with bad request', async () => {
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/password',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body must have required property \'token\'"}');
    });

    it('should reply 401 if token is invalid', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      await services.user.save(user);

      const token = jwt.sign({ email: user.email }, 'wrong secret', {
        algorithm: config.jwt.algorithm,
        expiresIn: config.authentication.passwordLostExpiresIn,
      });

      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/password',
        payload: {
          token,
          password: 'azerty1234',
        },
      });

      // Assert
      assert.equal(response.statusCode, 401);
    });

    it('should work', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      await services.user.save(user);
      const token = services.authentication.signResetPasswordToken(user.email);

      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/password',
        payload: {
          token,
          password: 'azerty1234',
        },
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('POST /authentication/password/reset-email', () => {
    it('should fail with bad request', async () => {
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/password/reset-email',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body must have required property \'email\'"}');
    });

    it('should reply 200 even if user does not exist', async () => {
      const email = 'nobody@abc-map.fr';

      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/password/reset-email',
        payload: {
          email,
          lang: Language.French,
        },
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });

    it('should work', async () => {
      const user = TestHelper.sampleUser();
      await services.user.save(user);

      // Act
      const response = await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/password/reset-email',
        payload: {
          email: user.email,
          lang: Language.French,
        },
      });

      // Assert
      // TODO: better assertion here, we do not prove that mail was sent
      assert.equal(response.statusCode, 200);
    });
  });

  describe('DELETE /', () => {
    it('should fail with bad request', async () => {
      const response = await server.getApp().inject({
        method: 'DELETE',
        path: '/api/authentication/',
        payload: {
          'wrong-var': 'wrong-val',
        },
      });

      assert.equal(response.statusCode, 400);
      assert.equal(response.body, '{"statusCode":400,"error":"Bad Request","message":"body must have required property \'password\'"}');
    });

    it('should fail if password is incorrect', async () => {
      const user = TestHelper.sampleUser();
      user.password = await passwordHasher.hashPassword('azerty1234', user.id);
      await services.user.save(user);
      const token = await services.authentication.signAuthenticationToken(user);

      // Act
      const response = await server.getApp().inject({
        method: 'DELETE',
        path: '/api/authentication',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          password: 'qwerty789',
        },
      });

      // Assert
      assert.equal(response.statusCode, 403);
    });

    it('should work', async () => {
      const user = TestHelper.sampleUser();
      user.password = await passwordHasher.hashPassword('azerty1234', user.id);
      await services.user.save(user);
      const token = await services.authentication.signAuthenticationToken(user);

      // Act
      const response = await server.getApp().inject({
        method: 'DELETE',
        path: '/api/authentication',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          password: 'azerty1234',
        },
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  it('should apply specific rate limit', async () => {
    const email = 'nobody@abc-map.fr';

    for (let i = 0; i <= config.server.authenticationRateLimit.max; i++) {
      await server.getApp().inject({
        method: 'POST',
        path: '/api/authentication/password/reset-email',
        headers: { 'x-forwarded-for': '10.10.10.10' },
        payload: { email, lang: Language.English },
      });
    }

    const blocked = await server.getApp().inject({
      method: 'POST',
      path: '/api/authentication/password/reset-email',
      headers: { 'x-forwarded-for': '10.10.10.10' },
      payload: { email, lang: Language.English },
    });
    const notBlocked = await server.getApp().inject({
      method: 'POST',
      path: '/api/authentication/password/reset-email',
      headers: { 'x-forwarded-for': '10.10.10.20' },
      payload: { email, lang: Language.English },
    });

    assert.equal(blocked.statusCode, 429);
    assert.match(blocked.body, /Quota of requests exceeded/);
    assert.equal(notBlocked.statusCode, 200);
  });
});
