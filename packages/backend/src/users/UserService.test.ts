import { UserService } from './UserService';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { TestHelper } from '../utils/TestHelper';
import { assert } from 'chai';
import * as uuid from 'uuid-random';
import { AnonymousUser } from '@abc-map/shared-entities';

describe('UserService', () => {
  let service: UserService;
  let client: MongodbClient;

  before(async () => {
    const config = await ConfigLoader.load();
    client = new MongodbClient(config);
    await client.connect();

    service = UserService.create(config, client);
    await service.init();
  });

  after(async () => {
    return client.disconnect();
  });

  describe('save()', () => {
    it('save() then findById()', async () => {
      const user = TestHelper.sampleUser();
      await service.save(user);
      const dbUser = await service.findById(user.id);
      assert.isDefined(dbUser);
      assert.equal(dbUser?.id, user.id);
      assert.equal(dbUser?.email, user.email);
      assert.equal(dbUser?.password, user.password);
    });

    it('should fail if email is reserved', async () => {
      const user = TestHelper.sampleUser();
      user.email = AnonymousUser.email;
      return service
        .save(user)
        .then(() => assert.fail('This operation should fail'))
        .catch((err) => assert.isTrue(err.message.endsWith('email is reserved')));
    });
  });

  describe('findByEmail()', () => {
    it('should return user', async () => {
      const user = TestHelper.sampleUser();
      await service.save(user);

      const dbUser = await service.findByEmail(user.email);
      assert.isDefined(dbUser);
      assert.equal(dbUser?.id, user.id);
      assert.equal(dbUser?.email, user.email);
      assert.equal(dbUser?.password, user.password);
    });

    it('should return undefined()', async () => {
      const res = await service.findByEmail(uuid());
      assert.isUndefined(res);
    });
  });
});
