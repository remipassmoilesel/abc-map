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

import * as Cypress from 'cypress';
import * as fs from 'fs';
import * as path from 'path';
import * as pixelmatch from 'pixelmatch';
import { Logger, Zipper } from '@abc-map/shared';
import { PNG } from 'pngjs';

const logger = Logger.get('PngComparison.ts');

export interface PngComparisonParams {
  actualZipPath: string;
  expectedZipPath: string;
  testId: string;
}

export interface PngComparisonResult {
  message: string;
  value: number;
  diff?: string;
}

export class PngComparison {
  public static setupNodeEvents(on: Cypress.PluginEvents) {
    on('task', {
      // This task compare two PNG exports.
      // It does not work very well between different setups (headed browser or headless, Firefox or Chromium, ...).
      // It may not work as expected on your workstation.
      async 'rendering-comparison'(params: PngComparisonParams): Promise<PngComparisonResult> {
        const { actualZipPath: relativeActualZipPath, expectedZipPath: relativeExpectedZipPath, testId } = params;
        const packageRoot = path.resolve(__dirname, '../..');
        const generatedFolder = path.resolve(packageRoot, 'generated');
        const actualZipPath = path.resolve(packageRoot, relativeActualZipPath);
        const expectedZipPath = path.resolve(packageRoot, relativeExpectedZipPath);

        logger.info('Starting comparison with parameters:', {
          packageRoot,
          generatedFolder,
          actualZipPath,
          expectedZipPath,
        });

        const actualContent = await Zipper.forNodeJS().unzip(fs.readFileSync(actualZipPath));
        const expectedContent = await Zipper.forNodeJS().unzip(fs.readFileSync(expectedZipPath));

        if (actualContent.length !== expectedContent.length) {
          return {
            value: 1,
            message: `Not the same number of pages, actual=${actualContent.length} expected=${expectedContent.length}`,
          };
        }

        for (let i = 0; i < actualContent.length; i++) {
          const actual = PNG.sync.read(actualContent[i].content);
          const expected = PNG.sync.read(expectedContent[i].content);
          if (actual.width !== expected.width || actual.height !== actual.height) {
            const debugInfos = `Page ${i + 1}, actual=${actual.width}x${actual.height} expected=${expected.width}x${expected.height}`;
            return {
              message: `Unable to compare images that are not the same size. ${debugInfos}`,
              value: 2,
            };
          }

          const diff = new PNG({ width: actual.width, height: actual.height });
          const numDiffPixels = pixelmatch(actual.data, expected.data, diff.data, expected.width, expected.height, {
            threshold: 0.1,
          });

          if (numDiffPixels) {
            const diffPath = path.resolve(generatedFolder, `diff-${testId}.png`);
            fs.writeFileSync(diffPath, PNG.sync.write(diff));
            return { message: 'Rendering not conform', value: 3, diff: diffPath };
          }
        }

        return { message: 'Rendering is conform', value: 0 };
      },
    });
  }
}
