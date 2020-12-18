import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import { assert } from 'chai';
import { TestHelper } from '../utils/TestHelper';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { AuthenticationService } from './AuthenticationService';
import { UserService } from '../users/UserService';
import { Config } from '../config/Config';
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
    client = new MongodbClient(config);
    await client.connect();
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

  describe('Token handling', () => {
    it('signToken() should work', async () => {
      const user = TestHelper.sampleUser();
      const token = service.signToken(user);
      assert.match(token, /^eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9\./i);

      const decoded = jwtDecode<Token>(token);
      assert.equal(decoded.userStatus, UserStatus.AUTHENTICATED);
      assert.equal(decoded.user.id, user.id);
      assert.equal(decoded.user.password, '');
      assert.notEqual(decoded.user.password, user.password);
      assert.equal(decoded.user.email, user.email);
      assert.equal(decoded.user.enabled, user.enabled);
    });

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
      const user = TestHelper.sampleUser();

      const status = await service.register({ email: user.email, password: user.password });
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
      const secret: string = (mailContent.match(/secret=(.+)"/i) as RegExpMatchArray)[1];
      assert.isAtLeast(secret.length, 50);

      const hmac = crypto.createHmac('sha512', config.registration.confirmationSalt);
      const truth = hmac.update(dbUser.id).digest('hex');
      assert.equal(secret, truth);
    });

    it('should fail if mail already exists', async () => {
      const user = TestHelper.sampleUser();
      await userService.save(user);

      const status = await service.register({ email: user.email, password: 'azerty1234' });
      assert.equal(status, RegistrationStatus.EmailAlreadyExists);
    });

    it('should fail if mail is reserved', async () => {
      const status = await service.register({ email: AnonymousUser.email, password: 'azerty1234' });
      assert.equal(status, RegistrationStatus.EmailAlreadyExists);
    });
  });

  describe('confirmAccount()', () => {
    it('confirmAccount() should not enable user if user not found', async () => {
      const user = TestHelper.sampleUser();
      const hmac = crypto.createHmac('sha512', config.registration.confirmationSalt);
      const secret = hmac.update(user.id).digest('hex');

      const status = await service.confirmAccount(user.id, secret);
      assert.equal(status, AccountConfirmationStatus.UserNotFound);
    });

    it('confirmAccount() should not enable user if secret is wrong', async () => {
      const user = TestHelper.sampleUser();
      user.enabled = false;
      await userService.save(user);

      const status = await service.confirmAccount(user.id, 'wrong-secret');
      assert.equal(status, AccountConfirmationStatus.Failed);
    });

    it('confirmAccount() should enable user', async () => {
      const user = TestHelper.sampleUser();
      user.enabled = false;
      await userService.save(user);

      const hmac = crypto.createHmac('sha512', config.registration.confirmationSalt);
      const secret = hmac.update(user.id).digest('hex');
      const status = await service.confirmAccount(user.id, secret);
      assert.equal(status, AccountConfirmationStatus.Succeed);
    });
  });

  describe('authenticate()', () => {
    it('should return UnknownUser status', async () => {
      const res = await service.authenticate(uuid.v4(), uuid.v4());
      assert.equal(res.status, AuthenticationStatus.UnknownUser);
    });

    it('should return Refused status', async () => {
      const user = TestHelper.sampleUser();
      await userService.save(user);

      const res = await service.authenticate(user.email, uuid.v4());
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
      const user = TestHelper.sampleUser();
      await service.register({ email: user.email, password: user.password });
      const dbUser = (await userService.findByEmail(user.email)) as AbcUser;
      dbUser.enabled = true;
      await userService.save(dbUser);

      const res = await service.authenticate(user.email, user.password);
      assert.equal(res.status, AuthenticationStatus.Successful);
      assert.isDefined(res.user);
      assert.equal(res.user?.id, dbUser.id);
      assert.equal(res.user?.email, user.email);
      assert.isDefined(res.user?.password);
      assert.equal(res.user?.password, '');
    });

    it('should return Successful status if user is anonymous', async () => {
      const res = await service.authenticate(AnonymousUser.email, '');
      assert.equal(res.status, AuthenticationStatus.Successful);
      assert.isDefined(res.user);
      assert.equal(res.user?.id, AnonymousUser.id);
      assert.equal(res.user?.email, AnonymousUser.email);
      assert.equal(res.user?.password, AnonymousUser.password);
    });
  });
});
