import { ConfigLoader } from './ConfigLoader';
import { assert } from 'chai';

// TODO: better test

describe('ConfigLoader', () => {
  it('load()', async () => {
    const config = await ConfigLoader.load();
    assert.isDefined(config.environmentName);
    assert.isDefined(config.development);

    assert.isDefined(config.server);
    assert.equal(config.server.host, '127.0.0.1');
    assert.equal(config.server.port, 10_082);

    assert.isDefined(config.database);
    assert.isTrue(config.database.url.startsWith('mongodb://'));
    assert.equal(config.database.username, 'admin');
    assert.equal(config.database.password, 'admin');

    assert.isDefined(config.authentication);
    assert.equal(config.authentication.passwordSalt, 'azerty1234');
    assert.equal(config.authentication.jwtSecret, 'azerty1234');
    assert.equal(config.authentication.jwtAlgorithm, 'HS512');
    assert.equal(config.authentication.jwtExpiresIn, '45min');
  });
});
