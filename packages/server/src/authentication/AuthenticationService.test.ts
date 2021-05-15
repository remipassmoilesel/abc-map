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

import * as uuid from 'uuid-random';
import * as jwt from 'jsonwebtoken';
import { assert } from 'chai';
import { TestHelper } from '../utils/TestHelper';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { AuthenticationService } from './AuthenticationService';
import { UserService } from '../users/UserService';
import { Config, DevelopmentDataConfig } from '../config/Config';
import { AbcUser, AccountConfirmationStatus, AnonymousUser, AuthenticationStatus, RegistrationStatus, Token, UserStatus } from '@abc-map/shared-entities';
import { PasswordHasher } from './PasswordHasher';
import { SmtpClient } from '../utils/SmtpClient';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import * as crypto from 'crypto';
import jwtDecode from 'jwt-decode';

describe('AuthenticationService', () => {
  let config: Config;
  let service: AuthenticationService;
  let userService: UserService;
  let client: MongodbClient;
  let hasher: PasswordHasher;
  let smtp: SmtpClient;
  let sendMailMock: SinonStub;

  before(async () => {
    config = await ConfigLoader.load();
    // We can disable this option because we mock smtp client
    config.development = { enabled: false } as DevelopmentDataConfig;
    client = await MongodbClient.createAndConnect(config);
  });

  beforeEach(async () => {
    hasher = new PasswordHasher(config);
    smtp = new SmtpClient(config);
    sendMailMock = sinon.stub(smtp, 'sendMail');

    userService = UserService.create(config, client);
    service = new AuthenticationService(config, userService, hasher, smtp);
    await userService.init();
    await service.init();
  });

  after(async () => {
    return client.disconnect();
  });

  describe('verifyToken()', () => {
    it('for disabled user', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.enabled = false;

      // Act
      try {
        service.signToken(user);
        assert.fail('Sign should fail');
      } catch (e) {
        // Assert
        assert.match(e.message, /User is disabled/);
      }
    });

    it('for authenticated user', async () => {
      // Prepare
      const user = TestHelper.sampleUser();

      // Act
      const token = service.signToken(user);

      // Assert
      assert.match(token, /^eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9\./i);
      const decoded = jwtDecode<Token>(token);
      assert.equal(decoded.userStatus, UserStatus.Authenticated);
      assert.equal(decoded.user.id, user.id);
      assert.equal(decoded.user.password, '<password-was-erased>');
      assert.equal(decoded.user.email, user.email);
      assert.equal(decoded.user.enabled, user.enabled);
    });

    it('for anonymous user', async () => {
      // Act
      const token = service.signToken(AnonymousUser);

      // Assert
      assert.match(token, /^eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9\./i);
      const decoded = jwtDecode<Token>(token);
      assert.equal(decoded.userStatus, UserStatus.Anonymous);
      assert.equal(decoded.user.id, AnonymousUser.id);
      assert.equal(decoded.user.password, '<password-was-erased>');
      assert.equal(decoded.user.email, AnonymousUser.email);
      assert.equal(decoded.user.enabled, AnonymousUser.enabled);
    });
  });

  describe('verifyToken()', () => {
    it('verifyToken() should return true', async () => {
      const user = TestHelper.sampleUser();
      const token = service.signToken(user);

      const tokenIsValid = await service.verifyToken(token);

      assert.isTrue(tokenIsValid);
    });

    it('verifyToken() should return false if token contains wrong chars', async () => {
      const user = TestHelper.sampleUser();
      const token = service.signToken(user);

      const tokenIsValid = await service.verifyToken(`${token}-with-wrong-chars`);

      assert.isFalse(tokenIsValid);
    });

    it('verifyToken() should return false if token is signed with a wrong secret', async () => {
      const user = TestHelper.sampleUser();
      const token = jwt.sign(user, 'wrong-secret', {
        algorithm: config.authentication.jwtAlgorithm,
        expiresIn: config.authentication.jwtExpiresIn,
      });

      const tokenIsValid = await service.verifyToken(token);

      assert.isFalse(tokenIsValid);
    });
  });

  describe('register()', () => {
    it('should save user then send mail with secret', async () => {
      // Prepare
      const user = TestHelper.sampleUser();

      // Act
      const status = await service.register({ email: user.email, password: user.password });

      // Assert
      assert.equal(status, RegistrationStatus.Successful);

      const dbUser = (await userService.findByEmail(user.email)) as AbcUser;
      assert.isDefined(dbUser);
      assert.isFalse(dbUser.enabled);
      assert.notEqual(dbUser.password, user.password); // Password must be encrypted here
      assert.equal(await hasher.hashPassword(user.password, dbUser.id), dbUser.password);

      assert.equal(sendMailMock.callCount, 1);
      assert.equal(sendMailMock.getCall(0).args[0], user.email);
      assert.equal(sendMailMock.getCall(0).args[1], 'Activation de votre compte Abc-Map');

      const mailContent = sendMailMock.getCall(0).args[2];
      const secret: string = (mailContent.match(/secret=([^"]+)"/i) as RegExpMatchArray)[1];
      assert.isAtLeast(secret.length, 50);

      const hmac = crypto.createHmac('sha512', config.registration.confirmationSalt);
      const truth = hmac.update(dbUser.id).digest('hex');
      assert.equal(secret, truth);
    });

    it('should fail if mail already exists', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      await userService.save(user);

      // Act
      const status = await service.register({ email: user.email, password: 'azerty1234' });

      // Assert
      assert.equal(status, RegistrationStatus.EmailAlreadyExists);
    });

    it('should fail if mail is reserved', async () => {
      // Act
      const status = await service.register({ email: AnonymousUser.email, password: 'azerty1234' });

      // Assert
      assert.equal(status, RegistrationStatus.EmailAlreadyExists);
    });
  });

  describe('confirmAccount()', () => {
    it('confirmAccount() should not enable user if user not found', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      const hmac = crypto.createHmac('sha512', config.registration.confirmationSalt);
      const secret = hmac.update(user.id).digest('hex');

      // Act
      const status = await service.confirmAccount(user.id, secret);

      // Assert
      assert.equal(status, AccountConfirmationStatus.UserNotFound);
    });

    it('confirmAccount() should not enable user if secret is wrong', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.enabled = false;
      await userService.save(user);

      // Act
      const status = await service.confirmAccount(user.id, 'wrong-secret');

      // Assert
      assert.equal(status, AccountConfirmationStatus.Failed);
    });

    it('confirmAccount() should enable user', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      user.enabled = false;
      await userService.save(user);

      const hmac = crypto.createHmac('sha512', config.registration.confirmationSalt);
      const secret = hmac.update(user.id).digest('hex');

      // Act
      const status = await service.confirmAccount(user.id, secret);

      // Assert
      assert.equal(status, AccountConfirmationStatus.Succeed);
    });
  });

  describe('authenticate()', () => {
    it('should return Refused status if user is unknown', async () => {
      const res = await service.authenticate(uuid(), uuid());

      assert.equal(res.status, AuthenticationStatus.Refused);
    });

    it('should return Refused status if password is wrong', async () => {
      const user = TestHelper.sampleUser();
      await userService.save(user);

      const res = await service.authenticate(user.email, uuid());

      assert.equal(res.status, AuthenticationStatus.Refused);
    });

    it('should return DisabledUser status', async () => {
      const user = TestHelper.sampleUser();
      user.enabled = false;
      await userService.save(user);

      const res = await service.authenticate(user.email, user.password);

      assert.equal(res.status, AuthenticationStatus.DisabledUser);
      assert.isUndefined(res.user);
    });

    it('should return Successful status', async () => {
      // Prepare
      const user = TestHelper.sampleUser();
      await service.register({ email: user.email, password: user.password });
      const dbUser = (await userService.findByEmail(user.email)) as AbcUser;
      dbUser.enabled = true;
      await userService.save(dbUser);

      // Act
      const res = await service.authenticate(user.email, user.password);

      // Assert
      assert.equal(res.status, AuthenticationStatus.Successful);
      assert.isDefined(res.user);
      assert.equal(res.user?.id, dbUser.id);
      assert.equal(res.user?.email, user.email);
      assert.isDefined(res.user?.password);
      assert.equal(res.user?.password, '<password-was-erased>');
    });

    it('should return Successful status if user is anonymous', async () => {
      const res = await service.authenticate(AnonymousUser.email, '');

      assert.equal(res.status, AuthenticationStatus.Successful);
      assert.isDefined(res.user);
      assert.isDefined(res.user?.id);
      assert.equal(res.user?.email, AnonymousUser.email);
      assert.equal(res.user?.password, AnonymousUser.password);
    });

    it('should generate ids for anonymous users', async () => {
      const res1 = await service.authenticate(AnonymousUser.email, '');
      const res2 = await service.authenticate(AnonymousUser.email, '');

      assert.isDefined(res1.user?.id);
      assert.isDefined(res2.user?.id);
      assert.notEqual(res1.user?.id, res2.user?.id);
    });
  });
});
