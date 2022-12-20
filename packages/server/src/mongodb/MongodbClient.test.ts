import { Config } from '../config/Config';
import { MongodbClient } from './MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';

describe('MongodbClient', () => {
  let config: Config;

  before(async () => {
    config = await ConfigLoader.load();
  });

  it('should connect', async () => {
    const client = await MongodbClient.createAndConnect(config);

    await client.disconnect();
  });
});
