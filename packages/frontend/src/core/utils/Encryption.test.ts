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

  describe('encryptManifest()', () => {
    it('layers with no secrets', async () => {
      const manifest = newClearManifest([TestHelper.sampleOsmLayer(), TestHelper.sampleVectorLayer()]);

      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

      expect(encrypted.metadata).toEqual({ ...manifest.metadata, containsCredentials: true });
      expect(encrypted.layers.length).toEqual(manifest.layers.length);
      expect(encrypted.layers).toEqual(manifest.layers);
    });

    it('WMS layer, with authentication', async () => {
      const original = TestHelper.sampleWmsLayer();
      const manifest = newClearManifest([original]);

      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

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
      const original = TestHelper.sampleWmsLayer();
      original.metadata.auth = undefined;
      const manifest = newClearManifest([original]);

      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

      const wms = encrypted.layers[0] as AbcWmsLayer;
      expect(wms.metadata.remoteUrls[0]).toMatch('encrypted:');
      expect(wms.metadata.remoteUrls[0]).not.toContain(original.metadata.remoteUrls[0]);

      expect(comparableMetadata(wms)).toEqual(comparableMetadata(original));
    });

    it('WMTS layer', async () => {
      const original = TestHelper.sampleWmtsLayer();
      const manifest = newClearManifest([original]);

      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

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
      const original = TestHelper.sampleXyzLayer();
      const manifest = newClearManifest([original]);

      const encrypted = await Encryption.encryptManifest(manifest, 'azerty1234');

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
