/*
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
 */

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

/*
 *
 * This script create a fake heavy project for performance tests.
 *
 * FIXME: Test setup freeze if size exceed few kb, probably due to k6 memory usage and FormDataPolyfill.ts
 *
 */

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const testDataDir = path.resolve(__dirname, '..', 'test-data');
  const projectPath = path.resolve(testDataDir, 'project.abm2');

  // Create test data dir if needed
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir);
  }

  // If project already exists, we quit
  if (fs.existsSync(projectPath)) {
    return;
  }
  console.log('Creating fake project ...');

  // Create fake project
  const zip = new JSZip();
  zip.file('manifest.json', createFakeManifest());
  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(projectPath, buffer);
}

function createFakeManifest() {
  // const length = 4_000_000; // ~ 8mb
  const length = 1_000; // ~ 4kb 😭
  const content = [];
  for (let i = 0; i < length; i++) {
    content.push(i);
  }
  return JSON.stringify(content);
}
