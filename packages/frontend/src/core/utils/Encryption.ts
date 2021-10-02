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

import * as sjcl from 'sjcl';
import { AbcLayer, AbcProjectManifest, AbcWmsLayer, AbcWmtsLayer, AbcXyzLayer, LayerType, WmsMetadata, WmtsMetadata, XyzMetadata } from '@abc-map/shared';
import { Errors } from './Errors';

/**
 * Warning: changes in this file will require a data migration
 */
export class Encryption {
  private static readonly PREFIX = 'encrypted:';

  public static async encrypt(text: string, secret: string): Promise<string> {
    return this.PREFIX + btoa(JSON.stringify(sjcl.encrypt(secret + secret, text).toString()));
  }

  public static async decrypt(text: string, secret: string): Promise<string> {
    const encrypted = JSON.parse(atob(text.substr(this.PREFIX.length)));
    try {
      return sjcl.decrypt(secret + secret, encrypted).toString();
    } catch (err) {
      Errors.wrongPassword(err);
    }
  }

  public static async encryptManifest(manifest: AbcProjectManifest, password: string): Promise<AbcProjectManifest> {
    const layers: AbcLayer[] = [];
    for (const lay of manifest.layers) {
      // WMS layer
      if (LayerType.Wms === lay.type) {
        const decrypted: AbcWmsLayer = {
          ...lay,
          metadata: await this.encryptWmsMetadata(lay.metadata, password),
        };
        layers.push(decrypted);
      }
      // WMTS layer
      else if (LayerType.Wmts === lay.type) {
        const decrypted: AbcWmtsLayer = {
          ...lay,
          metadata: await this.encryptWmtsMetadata(lay.metadata, password),
        };
        layers.push(decrypted);
      }
      // XYZ layers
      else if (LayerType.Xyz === lay.type) {
        const decrypted: AbcXyzLayer = {
          ...lay,
          metadata: await this.encryptXyzMetadata(lay.metadata, password),
        };
        layers.push(decrypted);
      }
      // Other layers
      else {
        layers.push(lay);
      }
    }

    return {
      ...manifest,
      metadata: {
        ...manifest.metadata,
        containsCredentials: true,
      },
      layers,
    };
  }

  public static async decryptManifest(manifest: AbcProjectManifest, password: string): Promise<AbcProjectManifest> {
    const layers: AbcLayer[] = [];
    for (const lay of manifest.layers) {
      // WMS
      if (LayerType.Wms === lay.type) {
        const decrypted: AbcWmsLayer = {
          ...lay,
          metadata: await this.decryptWmsMetadata(lay.metadata, password),
        };
        layers.push(decrypted);
      }
      // WMTS
      else if (LayerType.Wmts === lay.type) {
        const decrypted: AbcWmtsLayer = {
          ...lay,
          metadata: await this.decryptWmtsMetadata(lay.metadata, password),
        };
        layers.push(decrypted);
      }
      // XYZ layers
      else if (LayerType.Xyz === lay.type) {
        const decrypted: AbcXyzLayer = {
          ...lay,
          metadata: await this.decryptXyzMetadata(lay.metadata, password),
        };
        layers.push(decrypted);
      }
      // Other layers
      else {
        layers.push(lay);
      }
    }

    return {
      ...manifest,
      layers,
      metadata: {
        ...manifest.metadata,
        containsCredentials: false,
      },
    };
  }

  private static async encryptWmsMetadata(metadata: WmsMetadata, password: string): Promise<WmsMetadata> {
    const result: WmsMetadata = { ...metadata };

    // Encrypt URL, it may contains secret keys
    result.remoteUrls = await Promise.all(result.remoteUrls.map((url) => Encryption.encrypt(url, password)));

    // Encrypt authentication if any
    if (result.auth) {
      result.auth = { ...result.auth };
      result.auth.username = await Encryption.encrypt(result.auth.username, password);
      result.auth.password = await Encryption.encrypt(result.auth.password, password);
    }

    return result;
  }

  private static async encryptWmtsMetadata(metadata: WmtsMetadata, password: string): Promise<WmtsMetadata> {
    const result: WmtsMetadata = { ...metadata };

    // Encrypt URL, it may contains secret keys
    result.capabilitiesUrl = await Encryption.encrypt(result.capabilitiesUrl, password);

    // Encrypt authentication if any
    if (result.auth) {
      result.auth = { ...result.auth };
      result.auth.username = await Encryption.encrypt(result.auth.username, password);
      result.auth.password = await Encryption.encrypt(result.auth.password, password);
    }

    return result;
  }

  private static async decryptWmsMetadata(metadata: WmsMetadata, password: string): Promise<WmsMetadata> {
    const result: WmsMetadata = { ...metadata };

    result.remoteUrls = await Promise.all(result.remoteUrls.map((url) => Encryption.decrypt(url, password)));

    if (result.auth) {
      result.auth = { ...result.auth };
      result.auth.username = await Encryption.decrypt(result.auth.username, password);
      result.auth.password = await Encryption.decrypt(result.auth.password, password);
    }

    return result;
  }

  private static async decryptWmtsMetadata(metadata: WmtsMetadata, password: string): Promise<WmtsMetadata> {
    const result: WmtsMetadata = { ...metadata };

    result.capabilitiesUrl = await Encryption.decrypt(result.capabilitiesUrl, password);

    if (result.auth) {
      result.auth = { ...result.auth };
      result.auth.username = await Encryption.decrypt(result.auth.username, password);
      result.auth.password = await Encryption.decrypt(result.auth.password, password);
    }

    return result;
  }

  private static async encryptXyzMetadata(metadata: XyzMetadata, password: string): Promise<XyzMetadata> {
    const result: XyzMetadata = {
      ...metadata,
    };

    result.remoteUrl = await Encryption.encrypt(result.remoteUrl, password);
    return result;
  }

  private static async decryptXyzMetadata(metadata: XyzMetadata, password: string): Promise<XyzMetadata> {
    const result: XyzMetadata = {
      ...metadata,
    };

    result.remoteUrl = await Encryption.decrypt(result.remoteUrl, password);
    return result;
  }
}
