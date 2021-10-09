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

const path = require('path');
const uuid = require('uuid-random');
const fs = require('fs');
const childProcess = require('child_process');

const testRoot = path.resolve(__dirname, '../..');
const generatedDir = path.resolve(testRoot, 'generated');
const testDataDir = path.resolve(testRoot, 'src/test-data');

module.exports = (on, config) => {
  // Set windows size on launch for CI
  on('before:browser:launch', (browser = {}, launchOptions) => {
    const width = 1920;
    const height = 1080;

    if (browser.name === 'chrome' || browser.name === 'chromium') {
      launchOptions.args.push(`--window-size=${width},${height}`);

      // force screen to be non-retina and just use our given resolution
      launchOptions.args.push('--force-device-scale-factor=1');
    } else if (browser.name === 'electron') {
      // might not work on CI for some reason
      launchOptions.preferences.width = width;
      launchOptions.preferences.height = height;
    } else if (browser.name === 'firefox') {
      launchOptions.args.push(`--width=${width}`);
      launchOptions.args.push(`--height=${height}`);
    } else {
      console.error('Cannot set window size for runner, tests may fail.');
    }

    return launchOptions;
  });

  on('task', {
    // This task compare two PDF. It does not work very well between different states (headed browser or
    // headless, Firefo or Chromium, ...) So we prioritize headless chromium for CI.
    comparePdf({ actual, expected }) {
      const name = `${uuid()}.pdf`;
      const expectedPdfPath = path.resolve(testDataDir, expected);
      const expectedPngPath = path.resolve(generatedDir, expected);
      const actualPdfPath = path.resolve(generatedDir, name);
      const actualPngPath = path.resolve(generatedDir, name);
      const diffPath = path.resolve(generatedDir, `diff-${name}.png`);

      // Create generated data dir if necessary
      if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir);
      }

      // Write actual PDF then convert it to one PNG
      fs.writeFileSync(actualPdfPath, Buffer.from(actual.data));
      childProcess.execSync(`convert -quality 100 -density 100 ${actualPdfPath} ${actualPngPath}.png`);
      childProcess.execSync(`convert -quality 100 -density 100 -append ${actualPngPath}-*.png ${actualPngPath}.png`);

      // Convert expected PDF to one PNG
      childProcess.execSync(`convert -quality 100 -density 100 ${expectedPdfPath} ${expectedPngPath}.png`);
      childProcess.execSync(`convert -quality 100 -density 100 -append ${expectedPngPath}-*.png ${expectedPngPath}.png`);

      return new Promise(((resolve, reject) => {
        // Compare PDF
        // Image magick will return 0 same PDFs, and ]0,1] for different PDFs, 2 on error
        const compare = `compare -metric AE -fuzz 2% ${expectedPngPath}.png ${actualPngPath}.png -compose src ${diffPath}`;
        childProcess.exec(compare, (error) => {
          if (error && error.code === 2) {
            reject(error);
            return;
          }
          if (error) {
            resolve({ value: error.code, diff: diffPath });
            return;
          }
          resolve({ value: 0, diff: diffPath });
        });
      }));
    }
  });

  // Log console output if debug enabled
  if(process.env.DEBUG) {
    require('cypress-log-to-output').install(on);
  }
};
