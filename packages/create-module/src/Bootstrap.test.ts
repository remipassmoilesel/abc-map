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
import 'source-map-support/register.js';
import * as sinon from 'sinon';
import * as os from 'os';
import * as path from 'path';
import { Bootstrap, BootstrapParameters, logger } from './Bootstrap.js';
import { HttpClient } from './utils/HttpClient.js';
import { Shell } from './utils/Shell.js';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import { SinonStubbedInstance } from 'sinon';
import { assert } from 'chai';

logger.disable();

describe('Bootstrap', function () {
  let http: SinonStubbedInstance<HttpClient>;
  let shell: SinonStubbedInstance<Shell>;
  let params: BootstrapParameters;
  let template: Buffer;
  let bootstrap: Bootstrap;

  beforeEach(() => {
    http = sinon.createStubInstance(HttpClient);
    shell = sinon.createStubInstance(Shell);
    params = {
      name: 'test-module',
      destination: path.join(os.tmpdir(), `test-${nanoid()}`),
      sourceUrl: 'http://nowhere.net/template.zip',
      headers: { Authorization: 'abcdef' },
    };
    template = fs.readFileSync(path.resolve('__fixtures__/test-template.zip'));

    bootstrap = new Bootstrap(params, http, shell);
  });

  it('should unzip then init', async () => {
    // Prepare
    http.getArchive.resolves(template);

    // Act
    await bootstrap.start();

    // Assert
    const root = path.join(params.destination, params.name);
    assert.isTrue(fs.existsSync(path.join(root, 'README.md')));
    assert.isTrue(fs.existsSync(path.join(root, 'package.json')));

    const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json')).toString('utf-8'));
    assert.equal(packageJson.name, 'test-module');

    assert.deepEqual(shell.sync.args, [
      ['git init', { cwd: root, stdio: 'ignore' }],
      ['git add -A', { cwd: root, stdio: 'ignore' }],
      ['git commit -m "Add template 🚀"', { cwd: root, stdio: 'ignore' }],
      ['npm install', { cwd: root }],
    ]);
  });
});
