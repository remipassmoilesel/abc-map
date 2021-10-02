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

import { ProjectionSource } from './ProjectionSource';
import { SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import { ConfigLoader } from '../config/ConfigLoader';
import { MongodbClient } from '../mongodb/MongodbClient';
import { logger, ProjectionService } from './ProjectionService';
import { ProjectionDao } from './ProjectionDao';
import { ProjectionDocument } from './ProjectionDocument';
import * as uuid from 'uuid-random';
import * as _ from 'lodash';
import { assert } from 'chai';

logger.disable();

describe('ProjectionService', () => {
  describe('With a real database connection', () => {
    let client: MongodbClient;
    let dao: ProjectionDao;
    let source: SinonStubbedInstance<ProjectionSource>;
    let service: ProjectionService;

    before(async () => {
      const config = await ConfigLoader.load();
      client = await MongodbClient.createAndConnect(config);
      dao = new ProjectionDao(config, client);
      source = sinon.createStubInstance(ProjectionSource);

      service = new ProjectionService(dao, source as unknown as ProjectionSource);
    });

    after(() => {
      return client.disconnect();
    });

    it('findByCode() should return projection', async () => {
      // Prepare
      const doc: ProjectionDocument = {
        _id: uuid(),
        code: `EPSG:4326${uuid()}`,
        wkt: `GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,....`,
      };
      await dao.upsertByCode([doc]);

      // Act
      const proj = await service.findByCode(doc.code as string);

      // Assert
      assert.isDefined(proj);
      assert.equal(proj?.code, doc.code);
      assert.equal(proj?.wkt, doc.wkt);
    });

    it('findByCode() should return undefined', async () => {
      // Act
      const proj = await service.findByCode(`EPSG:${uuid()}`);

      // Assert
      assert.isUndefined(proj);
    });
  });

  describe('With a fake DAO and projection source', () => {
    let dao: SinonStubbedInstance<ProjectionDao>;
    let source: SinonStubbedInstance<ProjectionSource>;
    let service: ProjectionService;

    beforeEach(async () => {
      dao = sinon.createStubInstance(ProjectionDao);
      source = sinon.createStubInstance(ProjectionSource);

      service = new ProjectionService(dao as unknown as ProjectionDao, source as unknown as ProjectionSource);
    });

    it('index() should do nothing if projections up to date', async () => {
      // Prepare
      source.init.resolves();
      source.count.returns(50);
      dao.count.resolves(50);

      // Act
      await service.index(20);

      // Assert
      assert.equal(dao.upsertByCode.callCount, 0);
    });

    it('index() should index', async () => {
      // Prepare
      source.init.resolves();
      source.count.returns(50);
      dao.count.resolves(0);

      const fakeEntries = _.range(0, 50).map((i) => ({ path: `EPSG:${i}.json`, content: Buffer.from(JSON.stringify({ code: i })) }));
      source.getFiles.returns(fakeEntries);

      // Act
      await service.index(20);

      // Assert
      assert.equal(dao.upsertByCode.callCount, 3);
      assert.deepEqual(
        dao.upsertByCode.args[0][0].map((proj) => proj._id),
        fakeEntries.slice(0, 20).map((f) => f.path)
      );
      assert.deepEqual(
        dao.upsertByCode.args[1][0].map((proj) => proj._id),
        fakeEntries.slice(20, 40).map((f) => f.path)
      );
      assert.deepEqual(
        dao.upsertByCode.args[2][0].map((proj) => proj._id),
        fakeEntries.slice(40, 50).map((f) => f.path)
      );
    });
  });
});
