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
