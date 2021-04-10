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
