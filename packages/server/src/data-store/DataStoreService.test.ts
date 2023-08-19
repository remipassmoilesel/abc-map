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

import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { DataStoreService, logger } from './DataStoreService';
import { assert } from 'chai';
import { ArtefactDao } from './ArtefactDao';
import { DataStoreScanner } from './DataStoreScanner';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { AbcArtefact, ArtefactFilter, ArtefactType, Language } from '@abc-map/shared';
import { TestHelper } from '../utils/TestHelper';
import * as _ from 'lodash';
import * as uuid from 'uuid-random';
import { ArtefactManifestWithPath } from './ArtefactManifestSchema';

logger.disable();

describe('DatastoreService', () => {
  let scanner: SinonStubbedInstance<DataStoreScanner>;
  let client: MongodbClient;
  let service: DataStoreService;

  before(async () => {
    const config = await ConfigLoader.load();
    config.datastore.path = '/datastore/ '; // With trailing slash and space
    client = await MongodbClient.createAndConnect(config);
    const dao = new ArtefactDao(config, client);
    scanner = sinon.createStubInstance(DataStoreScanner);

    service = new DataStoreService(config, dao, scanner as unknown as DataStoreScanner);
    await service.init();
  });

  after(async () => {
    return client.disconnect();
  });

  it('saveAll()', async () => {
    // Prepare
    const artefact = TestHelper.sampleArtefact();

    // Act
    await service.saveAll([artefact]);

    // Assert
    const dbArtefact = await service.findById(artefact.id);
    assert.deepEqual(dbArtefact, artefact);
  });

  describe('search()', async () => {
    it('without filter', async () => {
      // Prepare
      const needle = uuid().replace(/[^a-z0-9]/gi, '');

      const artefacts: AbcArtefact[] = [
        {
          ...TestHelper.sampleArtefact(),
          type: ArtefactType.Vector,
          description: [
            {
              language: Language.English,
              text: `Burger of country ${needle}`,
            },
          ],
        },
        {
          ...TestHelper.sampleArtefact(),
          type: ArtefactType.BaseMap,
          description: [
            {
              language: Language.English,
              text: `Burger of country ${needle}`,
            },
          ],
        },
      ];
      await service.saveAll(artefacts);

      // Act
      const results = await service.search(needle, Language.English, 10, 0);

      // Assert
      assert.lengthOf(results, 2);
      assert.deepEqual(
        _(results)
          .sortBy((r) => r.id)
          .map((r) => r.id)
          .value(),
        _(artefacts)
          .sortBy((r) => r.id)
          .map((r) => r.id)
          .value()
      );
    });

    it('with filter', async () => {
      // Prepare
      const needle = uuid().replace(/[^a-z0-9]/gi, '');

      const artefacts: AbcArtefact[] = [
        {
          ...TestHelper.sampleArtefact(),
          type: ArtefactType.Vector,
          description: [
            {
              language: Language.English,
              text: `Burger of country ${needle}`,
            },
          ],
        },
        {
          ...TestHelper.sampleArtefact(),
          type: ArtefactType.BaseMap,
          description: [
            {
              language: Language.English,
              text: `Burger of country ${needle}`,
            },
          ],
        },
      ];
      await service.saveAll(artefacts);

      // Act
      const results = await service.search(needle, Language.English, 10, 0, ArtefactFilter.OnlyVectors);

      // Assert
      assert.lengthOf(results, 1);
      assert.deepEqual(results[0].id, artefacts[0].id);
    });
  });

  it('countArtefacts()', async () => {
    // Prepare
    await service.saveAll([TestHelper.sampleArtefact()]);

    // Act
    const result = await service.countArtefacts();

    // Assert
    assert.isTrue(result >= 1);
  });

  it('getRoot()', async () => {
    assert.equal(service.getRoot(), '/datastore');
  });

  it('index() should work', async () => {
    // Prepare
    const testId = uuid();
    const artefacts: ArtefactManifestWithPath[] = [
      TestHelper.sampleArtefactManifestWithPath(`${testId}-0`),
      TestHelper.sampleArtefactManifestWithPath(`${testId}-1`),
      TestHelper.sampleArtefactManifestWithPath(`${testId}-2`),
    ].sort((a, b) => a.artefact.name[0].text.localeCompare(b.artefact.name[0].text));

    scanner.scan.resolves(artefacts);

    // Act
    await service.index();

    // Assert
    const dbArtefacts = (await service.list(10)).sort((a, b) => a.name[0].text.localeCompare(b.name[0].text));
    assert.lengthOf(dbArtefacts, artefacts.length);

    for (let i = 0; i < artefacts.length; i++) {
      const actual = dbArtefacts[i];
      const expected = artefacts[i];
      assert.deepEqual(actual.name, expected.artefact.name);
      assert.deepEqual(actual.keywords, expected.artefact.keywords);
      assert.deepEqual(actual.link, expected.artefact.link);
      assert.deepEqual(actual.description, expected.artefact.description);

      // Downloadable file paths must be relative to datastore path
      assert.deepEqual(
        actual.files,
        expected.artefact.files?.map((file) => `${testId}-${i}/${file}`)
      );
      assert.deepEqual(actual.license, `${testId}-${i}/${expected.artefact.license}`);
    }
  });
});
