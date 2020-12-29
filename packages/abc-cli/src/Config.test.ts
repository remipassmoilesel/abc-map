import { Config } from './Config';
import { assert } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe('Config', () => {
  it('should return correct paths', () => {
    const config = new Config();
    assert.isTrue(fs.existsSync(path.resolve(config.getProjectRoot(), 'lerna.json')));
    assert.isTrue(fs.existsSync(path.resolve(config.getCliRoot(), 'src/Parser.ts')));
    assert.isTrue(fs.existsSync(path.resolve(config.getDevServicesRoot(), 'docker-compose.yml')));
    assert.isTrue(fs.existsSync(path.resolve(config.getBackendRoot(), 'src/server/HttpServer.ts')));
    assert.isTrue(fs.existsSync(path.resolve(config.getE2eRoot(), 'src/integration/0_registration-login-spec.ts')));
  });
});
