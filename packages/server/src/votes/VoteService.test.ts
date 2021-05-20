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

import { VoteService } from './VoteService';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { assert } from 'chai';
import { TestHelper } from '../utils/TestHelper';
import { VoteValue } from '@abc-map/shared';

describe('VoteService', () => {
  let service: VoteService;
  let client: MongodbClient;

  before(async () => {
    const config = await ConfigLoader.load();
    client = await MongodbClient.createAndConnect(config);

    service = VoteService.create(client);
    await service.init();
  });

  after(async () => {
    return client.disconnect();
  });

  it('save() then aggregate should work', async () => {
    // Prepare
    const start = TestHelper.randomDate();
    await service.save({ value: VoteValue.NOT_SATISFIED }, start.plus({ minute: 1 }));
    await service.save({ value: VoteValue.BLAH }, start.plus({ minute: 2 }));
    await service.save({ value: VoteValue.BLAH }, start.plus({ minute: 3 }));
    await service.save({ value: VoteValue.SATISFIED }, start.plus({ minute: 4 }));
    await service.save({ value: VoteValue.SATISFIED }, start.plus({ minute: 5 }));
    await service.save({ value: VoteValue.SATISFIED }, start.plus({ minute: 6 }));
    const end = start.plus({ minute: 7 });

    // Act
    const res = await service.aggregate(start, end);

    // Assert
    assert.equal(res.notSatisfied, 17);
    assert.equal(res.blah, 33);
    assert.equal(res.satisfied, 50);
    assert.equal(res.start, start.toISODate());
    assert.equal(res.end, end.toISODate());
    assert.equal(res.total, 6);
  });

  it('aggregate should work even if period does not have counts', async () => {
    // Prepare
    const start = TestHelper.randomDate();
    const end = start.plus({ minute: 6 });

    // Act
    const res = await service.aggregate(start, end);

    // Assert
    assert.equal(res.notSatisfied, 0);
    assert.equal(res.blah, 0);
    assert.equal(res.satisfied, 0);
    assert.equal(res.start, start.toISODate());
    assert.equal(res.end, end.toISODate());
    assert.equal(res.total, 0);
  });
});
