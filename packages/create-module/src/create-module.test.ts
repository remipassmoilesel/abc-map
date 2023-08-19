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

import 'source-map-support/register.js';
import { execSync } from 'child_process';
import { Logger } from './utils/Logger.js';
import * as uuid from 'uuid';
import * as url from 'url';

const logger = Logger.get('create-module.test.ts', 'warn');

const DEBUG = false;

describe('create-module', function () {
  this.timeout(240_000);

  it('should create a module template that can build', () => {
    const moduleName = `create-module-test-${uuid.v4()}`;
    const createModule = url.fileURLToPath(new URL('..', import.meta.url));

    shellCommand(`npx -p ${createModule} create-module --name ${moduleName}`, '/tmp');
    shellCommand('npm run build', `/tmp/${moduleName}`);
  });

  // Use this test to check another template
  it.skip('should create a module template from specified source URL', () => {
    const templateUrl = 'https://gitlab.com/api/v4/projects/MY_USERNAME%2Fmodule-template/repository/archive.zip?sha=ac1fea6';
    const headers = { 'Private-Token': 'XXXXXXXXXXXXXXXXXXXXXXXXXXX' };
    const env = `ABC_CREATE_MODULE_SOURCE_URL='${templateUrl}' ABC_CREATE_MODULE_HEADERS='${JSON.stringify(headers)}'`;

    const moduleName = `create-module-test-${uuid.v4()}`;
    const createModule = url.fileURLToPath(new URL('..', import.meta.url));

    shellCommand(`${env} npx -p ${createModule} create-module --name ${moduleName}`, '/tmp');
    shellCommand('npm run build', `/tmp/${moduleName}`);
  });
});

function shellCommand(command: string, cwd: string) {
  execSync(command, { shell: '/bin/sh', stdio: DEBUG ? 'inherit' : 'pipe', cwd });
}
