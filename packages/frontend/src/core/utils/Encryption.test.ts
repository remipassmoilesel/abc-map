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

import { Encryption } from './Encryption';
import { TestHelper } from './test/TestHelper';
import { deepFreeze } from './deepFreeze';
import { AbcProjectManifest, AbcWmsLayer, AbcXyzLayer } from '@abc-map/shared';
import { Errors } from './Errors';

/**
 * Warning: changes on encryption will require a data migration
 */
describe('Encryption', () => {
  it('encrypt()', async () => {
    const result = await Encryption.encrypt('test', 'secret');
    expect(result).not.toEqual('test');
    expect(result).toMatch('encrypted:');
  });

  describe('decrypt()', () => {
    it('with correct secret', async () => {
      const encrypted = await Encryption.encrypt('test', 'secret');
      const result = await Encryption.decrypt(encrypted, 'secret');
      expect(result).toEqual('test');
    });

    it('with incorrect secret', async () => {
      const encrypted = await Encryption.encrypt('test', 'secret');
      const error: Error = await Encryption.decrypt(encrypted, 'not-the-secret').catch((err) => err);
      expect(Errors.isWrongPassword(error)).toBe(true);
    });
  });

  it('encryptManifest()', async () => {
    // Prepare
    const manifest: AbcProjectManifest = deepFreeze({
      ...TestHelper.sampleProjectManifest(),
      layers: [...TestHelper.sampleProjectManifest().layers, TestHelper.sampleWmsLayer(), TestHelper.sampleXyzLayer()],
      metadata: {
        ...TestHelper.sampleProjectManifest().metadata,
        containsCredentials: false,
      },
    });

    // Act
    const result = await Encryption.encryptManifest(manifest, 'azerty1234');

    expect(result.metadata).toEqual({ ...manifest.metadata, containsCredentials: true });
    expect(result.layers.length).toEqual(manifest.layers.length);
    expect(result.layers.slice(0, 2)).toEqual(manifest.layers.slice(0, 2));

    const originalWms = manifest.layers[2] as AbcWmsLayer;
    const wms = result.layers[2] as AbcWmsLayer;
    expect(wms.metadata.remoteUrl).toMatch('encrypted:');
    expect(wms.metadata.auth?.username).toMatch('encrypted:');
    expect(wms.metadata.auth?.password).toMatch('encrypted:');
    expect(wms.metadata.remoteUrl).not.toEqual(originalWms.metadata.remoteUrl);
    expect(wms.metadata.auth?.username).not.toEqual(originalWms.metadata.auth?.username);
    expect(wms.metadata.auth?.password).not.toEqual(originalWms.metadata.auth?.password);

    const originalXyz = manifest.layers[2] as AbcXyzLayer;
    const xyz = result.layers[2] as AbcXyzLayer;
    expect(xyz.metadata.remoteUrl).toMatch('encrypted:');
    expect(xyz.metadata.remoteUrl).not.toEqual(originalXyz.metadata.remoteUrl);
  });

  it('decryptManifest()', async () => {
    // Prepare
    const manifest = deepFreeze({
      ...TestHelper.sampleProjectManifest(),
      layers: [...TestHelper.sampleProjectManifest().layers, TestHelper.sampleWmsLayer(), TestHelper.sampleXyzLayer()],
    });
    const encrypted = deepFreeze(await Encryption.encryptManifest(manifest, 'azerty1234'));

    // Act
    const result = await Encryption.decryptManifest(encrypted, 'azerty1234');

    expect(result.metadata).toEqual({ ...manifest.metadata, containsCredentials: false });
    expect(result.layers.length).toEqual(manifest.layers.length);
    expect(result.layers.slice(0, 2)).toEqual(manifest.layers.slice(0, 2));

    const originalWms = manifest.layers[2] as AbcWmsLayer;
    const wms = result.layers[2] as AbcWmsLayer;
    expect(wms.metadata.remoteUrl).toEqual(originalWms.metadata.remoteUrl);
    expect(wms.metadata.auth?.username).toEqual(originalWms.metadata.auth?.username);
    expect(wms.metadata.auth?.password).toEqual(originalWms.metadata.auth?.password);

    const originalXyz = manifest.layers[2] as AbcXyzLayer;
    const xyz = result.layers[2] as AbcXyzLayer;
    expect(xyz.metadata.remoteUrl).toEqual(originalXyz.metadata.remoteUrl);
  });
});
