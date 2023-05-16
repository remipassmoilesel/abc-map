/**
 * Copyright © 2022 Rémi Pace.
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

import {
  AbcLayer,
  AbcProjectManifest,
  AbcWmsLayer,
  AbcWmtsLayer,
  AbcXyzLayer,
  LayerType,
  Logger,
  WmsMetadata,
  WmtsMetadata,
  XyzMetadata,
} from '@abc-map/shared';
import { Encryption } from '../../../utils/Encryption';

const logger = Logger.get('DeprecatedEncryption.ts');

/**
 * These types of layer contain credentials
 */
const ProtectedLayerTypes = [LayerType.Wms, LayerType.Wmts, LayerType.Xyz];

export class DeprecatedEncryption {
  public static deprecatedManifestContainsCredentials(project: AbcProjectManifest): boolean {
    const protectedLayer = project.layers.find((lay) => ProtectedLayerTypes.includes(lay.type));

    return !!protectedLayer;
  }

  public static extractWitness(project: AbcProjectManifest): string | undefined {
    const protectedLayer = project.layers.find((lay) => ProtectedLayerTypes.includes(lay.type));
    if (LayerType.Wms === protectedLayer?.type) {
      return protectedLayer.metadata.remoteUrls[0];
    }
    if (LayerType.Wmts === protectedLayer?.type) {
      return protectedLayer.metadata.capabilitiesUrl;
    }
    if (LayerType.Xyz === protectedLayer?.type) {
      return protectedLayer.metadata.remoteUrl;
    }
    if (protectedLayer) {
      logger.error('Unhandled protected layer type: ', protectedLayer?.type);
    }
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

  private static async decryptXyzMetadata(metadata: XyzMetadata, password: string): Promise<XyzMetadata> {
    const result: XyzMetadata = {
      ...metadata,
    };

    result.remoteUrl = await Encryption.decrypt(result.remoteUrl, password);
    return result;
  }
}
