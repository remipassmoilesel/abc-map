/**
 * Copyright © 2023 Rémi Pace.
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

import { UserService } from './UserService';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { TestHelper } from '../utils/TestHelper';
import { assert } from 'chai';
import * as uuid from 'uuid-random';
import { AnonymousUser } from '@abc-map/shared';

describe('UserService', () => {
  let service: UserService;
  let client: MongodbClient;

  before(async () => {
    const config = await ConfigLoader.load();
    client = await MongodbClient.createAndConnect(config);

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

    it('should return undefined', async () => {
      const res = await service.findByEmail(uuid());
      assert.isUndefined(res);
    });
  });

  it('delete()', async () => {
    const user = TestHelper.sampleUser();
    await service.save(user);

    await service.deleteById(user.id);

    const res = await service.findById(user.id);
    assert.isUndefined(res);
  });
});
