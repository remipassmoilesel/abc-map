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
 *
 *
 *
 */

const { execSync } = require('child_process');

const outputPath = 'build';
const inputPaths = ['src'];

main();

function main() {
  const watch = process.argv.indexOf('--watch') !== -1;

  const cliInputs = inputPaths.map((input) => input + ':' + outputPath).join(' ');
  const command = ['./node_modules/.bin/sass', watch ? '--watch' : '', cliInputs].filter((v) => !!v).join(' ');
  console.log(`\n 🛠️   ${command} \n`);
  execSync(command, { shell: true, stdio: 'inherit' });
}
