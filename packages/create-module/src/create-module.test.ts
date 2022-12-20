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
import { Logger } from './utils/Logger';
import * as path from 'path';
import * as uuid from 'uuid';

const logger = Logger.get('create-module.test.ts', 'warn');

const DEBUG = false;

describe('create-module', function () {
  this.timeout(120_000);

  it('should create a module template', () => {
    const moduleName = `create-module-test-${uuid.v4()}`;
    const createModuleRoot = path.resolve(__dirname, '..');

    shellCommand(`echo $PATH; npx -p ${createModuleRoot} create-module --name ${moduleName}`, '/tmp');
    shellCommand('yarn run build', `/tmp/${moduleName}`);
  });
});

function shellCommand(command: string, cwd: string) {
  execSync(command, { shell: '/bin/sh', stdio: DEBUG ? 'inherit' : 'pipe', cwd });
}
