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

import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { DataStoreService, logger } from './DataStoreService';
import { assert } from 'chai';
import { Resources } from '../utils/Resources';

logger.disable();

// TODO: refactor tests
describe('DatastoreService', () => {
  const ressources = new Resources();
  let service: DataStoreService;
  let client: MongodbClient;

  before(async () => {
    const config = await ConfigLoader.load();
    config.datastore.path = ressources.getResourcePath('test/datastore');
    client = await MongodbClient.createAndConnect(config);

    service = DataStoreService.create(config, client);
    await service.init();
  });

  after(async () => {
    return client.disconnect();
  });

  it('index() should work', async () => {
    await service.index();

    const artefacts = (await service.list(10)).sort((a, b) => a.name.localeCompare(b.name));
    artefacts.forEach((art) => {
      assert.isDefined(art.id);
      assert.isDefined(art.name);
      assert.isDefined(art.link);
      assert.isDefined(art.license);
    });
    assert.deepEqual(
      artefacts.map((art) => art.name),
      ['Hydrographie du monde', 'Lacs du monde', 'Pays du monde', 'Villes du monde']
    );
    assert.deepEqual(
      artefacts.map((art) => art.path),
      ['world/world-hydrography/artefact.yml', 'world/world-lakes/artefact.yml', 'world/world-countries/artefact.YAML', 'world/world-cities/artefact.yaml']
    );
    assert.deepEqual(
      artefacts.map((art) => art.license),
      ['world/world-hydrography/README.txt', 'world/world-lakes/README.txt', 'world/world-countries/README.txt', 'world/world-cities/README.txt']
    );
  });

  it('index() should produce correct result even if called twice', async () => {
    await service.index();
    await service.index();

    const artefacts = (await service.list(10)).sort((a, b) => a.name.localeCompare(b.name));
    assert.deepEqual(
      artefacts.map((art) => art.name),
      ['Hydrographie du monde', 'Lacs du monde', 'Pays du monde', 'Villes du monde']
    );
  });
});
