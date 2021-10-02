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
import { AbcLayer, AbcProjectManifest, AbcWmsLayer, AbcWmtsLayer, AbcXyzLayer } from '@abc-map/shared';
import { Errors } from './Errors';
import _ from 'lodash';
import { MapFactory } from '../geo/map/MapFactory';
import { LayerFactory } from '../geo/layers/LayerFactory';

/**
 * Warning: changes on encryption will require a data migration
 */
describe('Encryption', () => {
  it('encrypt()', async () => {
    const result = await Encryption.encrypt('text to encrypt', 'secret');
    expect(result).not.toEqual('test');
    expect(result).toMatch('encrypted:');
  });

  describe('decrypt()', () => {
    /**
     * If this test fail, you must migrate projects
     */
    it('with correct secret', async () => {
      /* eslint-disable */
      const encrypted = 'encrypted:IntcIml2XCI6XCJsZm5XeTVoeUlSU1BuRWh4WWlOazZnPT1cIixcInZcIjoxLFwiaXRlclwiOjEwMDAwLFwia3NcIjoxMjgsXCJ0c1wiOjY0LFwibW9kZVwiOlwiY2NtXCIsXCJhZGF0YVwiOlwiXCIsXCJjaXBoZXJcIjpcImFlc1wiLFwic2FsdFwiOlwiZ25mM2RZbmxBVEE9XCIsXCJjdFwiOlwic09McnlaYjJ0dFNKV0dnenhKOTdiamFtdHZNWnVjND1cIn0i';
      /* eslint-enable */
      const result = await Encryption.decrypt(encrypted, 'secret');
      expect(result).toEqual('text to decrypt');
    });

    it('with incorrect secret', async () => {
      const encrypted = await Encryption.encrypt('test', 'secret');
      const error: Error = await Encryption.decrypt(encrypted, 'not-the-secret').catch((err) => err);
      expect(Errors.isWrongPassword(error)).toBe(true);
    });
  });

  describe('mapContainsCredentials()', () => {
    it('should return false', () => {
      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newVectorLayer());

      expect(Encryption.mapContainsCredentials(map)).toEqual(false);
    });

    it('should return true if XYZ layer', () => {
      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newXyzLayer('http://test-url'));

      expect(Encryption.mapContainsCredentials(map)).toEqual(true);
    });

    it('should return true if WMS layer', () => {
      const map = MapFactory.createNaked();
      map.addLayer(
        LayerFactory.newWmsLayer({
          capabilitiesUrl: 'http://test-capabilitiesUrl',
          remoteUrls: ['http://test-remoteUrl'],
          remoteLayerName: 'test-remoteLayerName',
          auth: {
            username: 'username',
            password: 'password',
          },
        })
      );

      expect(Encryption.mapContainsCredentials(map)).toEqual(true);
    });

    it('should return true if WMTS layer', () => {
      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newWmtsLayer(TestHelper.sampleWmtsSettings()));

      expect(Encryption.mapContainsCredentials(map)).toEqual(true);
    });
  });

  describe('encryptManifest()', () => {
    it('layers with no secrets', async () => {
      // Prepare
      const manifest = newClearManifest([TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer()]);

      // Act
      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

      // Assert
      expect(encrypted.metadata).toEqual({ ...manifest.metadata, containsCredentials: false });
      expect(encrypted.layers.length).toEqual(manifest.layers.length);
      expect(encrypted.layers).toEqual(manifest.layers);
    });

    it('WMS layer, with authentication', async () => {
      // Prepare
      const original = TestHelper.sampleWmsLayer();
      const manifest = newClearManifest([original]);

      // Act
      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

      // Assert
      expect(encrypted.metadata.containsCredentials).toEqual(true);

      const wms = encrypted.layers[0] as AbcWmsLayer;
      expect(wms.metadata.remoteUrls[0]).toMatch('encrypted:');
      expect(wms.metadata.auth?.username).toMatch('encrypted:');
      expect(wms.metadata.auth?.password).toMatch('encrypted:');
      expect(wms.metadata.remoteUrls[0]).not.toContain(original.metadata.remoteUrls[0]);
      expect(wms.metadata.auth?.username).not.toContain(original.metadata.auth?.username);
      expect(wms.metadata.auth?.password).not.toContain(original.metadata.auth?.password);

      expect(comparableMetadata(wms)).toEqual(comparableMetadata(original));
    });

    it('WMS layer, without authentication', async () => {
      // Prepare
      const original = TestHelper.sampleWmsLayer();
      original.metadata.auth = undefined;
      const manifest = newClearManifest([original]);

      // Act
      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

      // Assert
      expect(encrypted.metadata.containsCredentials).toEqual(true);

      const wms = encrypted.layers[0] as AbcWmsLayer;
      expect(wms.metadata.remoteUrls[0]).toMatch('encrypted:');
      expect(wms.metadata.remoteUrls[0]).not.toContain(original.metadata.remoteUrls[0]);

      expect(comparableMetadata(wms)).toEqual(comparableMetadata(original));
    });

    it('WMTS layer', async () => {
      // Prepare
      const original = TestHelper.sampleWmtsLayer();
      const manifest = newClearManifest([original]);

      // Act
      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

      // Assert
      expect(encrypted.metadata.containsCredentials).toEqual(true);

      const wmts = encrypted.layers[0] as AbcWmtsLayer;
      expect(wmts.metadata.capabilitiesUrl).toMatch('encrypted:');
      expect(wmts.metadata.auth?.username).toMatch('encrypted:');
      expect(wmts.metadata.auth?.password).toMatch('encrypted:');
      expect(wmts.metadata.capabilitiesUrl).not.toContain(original.metadata.capabilitiesUrl);
      expect(wmts.metadata.auth?.username).not.toContain(original.metadata.auth?.username);
      expect(wmts.metadata.auth?.password).not.toContain(original.metadata.auth?.password);

      expect(comparableMetadata(wmts)).toEqual(comparableMetadata(original));
    });

    it('XYZ layer', async () => {
      // Prepare
      const original = TestHelper.sampleXyzLayer();
      const manifest = newClearManifest([original]);

      // Act
      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

      // Assert
      expect(encrypted.metadata.containsCredentials).toEqual(true);

      const xyz = encrypted.layers[0] as AbcXyzLayer;
      expect(xyz.metadata.remoteUrl).toMatch('encrypted:');
      expect(xyz.metadata.remoteUrl).not.toContain(original.metadata.remoteUrl);

      expect(comparableMetadata(xyz)).toEqual(comparableMetadata(original));
    });
  });

  describe('decryptManifest()', () => {
    it('layers with no secrets', async () => {
      const originals = deepFreeze([TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer()]);
      const manifest = await newEncryptedManifest(originals);

      const result = await Encryption.decryptManifest(manifest, 'azerty1234');

      expect(result.layers).toEqual(originals);
    });

    it('WMS with authentication', async () => {
      const original = deepFreeze(TestHelper.sampleWmsLayer());
      const manifest = await newEncryptedManifest([original]);

      const result = await Encryption.decryptManifest(manifest, 'azerty1234');

      expect(result.layers[0]).toEqual(original);
    });

    it('WMTS with authentication', async () => {
      const original = deepFreeze(TestHelper.sampleWmtsLayer());
      const manifest = await newEncryptedManifest([original]);

      const result = await Encryption.decryptManifest(manifest, 'azerty1234');

      expect(result.layers[0]).toEqual(original);
    });

    it('XYZ', async () => {
      const original = deepFreeze(TestHelper.sampleXyzLayer());
      const manifest = await newEncryptedManifest([original]);

      const result = await Encryption.decryptManifest(manifest, 'azerty1234');

      expect(result.layers[0]).toEqual(original);
    });
  });

  it('extractEncryptedData()', () => {
    let project = { layers: [] } as unknown as AbcProjectManifest;
    expect(Encryption.extractEncryptedData(project)).toBeUndefined();

    project = { layers: [TestHelper.sampleWmsLayer()] } as unknown as AbcProjectManifest;
    expect(Encryption.extractEncryptedData(project)).toEqual('http://domain.fr/wms');

    project = { layers: [TestHelper.sampleXyzLayer()] } as unknown as AbcProjectManifest;
    expect(Encryption.extractEncryptedData(project)).toEqual('http://domain.fr/xyz/{x}/{y}/{z}');

    project = { layers: [TestHelper.sampleWmtsLayer()] } as unknown as AbcProjectManifest;
    expect(Encryption.extractEncryptedData(project)).toEqual('http://domain.fr/wmts');
  });
});

function newClearManifest(layers: AbcLayer[]): AbcProjectManifest {
  // We "freeze" project in order to check immutability
  const template = TestHelper.sampleProjectManifest();
  return deepFreeze({
    ...template,
    layers,
    metadata: {
      ...template.metadata,
      containsCredentials: false,
    },
  });
}

async function newEncryptedManifest(layers: AbcLayer[]): Promise<AbcProjectManifest> {
  // We "freeze" project in order to check immutability
  const template = TestHelper.sampleProjectManifest();
  const manifest = deepFreeze({ ...template, layers });
  const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

  return deepFreeze(encrypted);
}

function comparableMetadata(meta: any): any {
  return _.omit(meta, ['metadata.auth', 'metadata.remoteUrl', 'metadata.remoteUrls', 'metadata.capabilitiesUrl']);
}
