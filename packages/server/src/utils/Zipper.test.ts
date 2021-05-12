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

import { Zipper } from './Zipper';
import { AbcFile } from './AbcFile';
import { Resources } from './Resources';
import * as fs from 'fs';
import { assert } from 'chai';
import { ManifestName } from '@abc-map/shared-entities';

describe('Zipper', () => {
  const resources = new Resources();
  const sampleZip = resources.getSampleProject();

  it('should unzip', async () => {
    const archive = fs.readFileSync(sampleZip);

    const result = await Zipper.unzip(archive);

    const paths = result.map((r) => r.path).sort();
    assert.deepEqual(paths, [ManifestName]);

    const sizes = result.map((r) => r.content.length).sort();
    assert.deepEqual(sizes, [1262]);
  });

  it('should zip', async () => {
    const testFile: AbcFile = { path: 'test.json', content: Buffer.from(JSON.stringify({ a: 'b', c: 'd', e: 'f' })) };

    const result = await Zipper.zipFiles([testFile]);

    assert.deepEqual(result.length, 139);
  });
});
