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

import 'source-map-support/register';
import { execSync } from 'child_process';
import { Logger } from './utils';
import * as path from 'path';
import * as uuid from 'uuid';

const logger = Logger.get('module-api.test.ts', 'warn');

const DEBUG = false;

describe('module-api', function () {
  // You can add here a custom template URL or leave it empty to use default template
  const TEMPLATE_URL = '';
  const HEADERS = {};

  // Here we create a module template using this version of @abc-map/module-api,
  // then we build in order to detect breaking changes.
  // If this test does not pass anymore, you will have to update module template at least
  it('should not break module template', () => {
    const moduleName = `module-api-test-${uuid.v4()}`;
    const moduleApiRoot = path.resolve(__dirname, '..');
    const createModule = path.resolve(__dirname, '../../create-module/build/create-module.js');

    const env = `ABC_CREATE_MODULE_SOURCE_URL='${TEMPLATE_URL}' ABC_CREATE_MODULE_HEADERS='${JSON.stringify(HEADERS)}'`;
    shellCommand(`${env}  ${createModule} --name ${moduleName}`, '/tmp');
    shellCommand('yarn link', moduleApiRoot);
    shellCommand('yarn link @abc-map/module-api', `/tmp/${moduleName}`);
    shellCommand('yarn run build', `/tmp/${moduleName}`);
  });
});

function shellCommand(command: string, cwd: string) {
  execSync(command, { shell: '/bin/bash', stdio: DEBUG ? 'inherit' : 'pipe', cwd });
}
