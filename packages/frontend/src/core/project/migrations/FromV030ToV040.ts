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

import { AbcFile, AbcLayer, AbcProjection, AbcProjectManifest, AbcProjectMetadata, BaseMetadata, BasicAuthentication, LayerType } from '@abc-map/shared';
import { MigratedProject, ProjectMigration } from './typings';
import semver from 'semver';

const NEXT = '0.4.0';

export interface AbcProjectMetadata030 extends AbcProjectMetadata {
  projection?: AbcProjection;
}

export interface WmsMetadata030 extends BaseMetadata {
  type: LayerType.Wms;
  projection?: AbcProjection;
  extent?: [number, number, number, number];
  remoteUrl: string;
  remoteLayerName: string;
  auth?: BasicAuthentication;
}

/**
 * This migration:
 * - adds multiple WMS remote urls
 * - delete projection field in metadata
 */
export class FromV030ToV040 implements ProjectMigration {
  public async interestedBy(manifest: AbcProjectManifest): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(manifest: AbcProjectManifest, files: AbcFile[]): Promise<MigratedProject> {
    const upgrated: AbcLayer[] = manifest.layers.map((layer) => {
      // We ignore other layers
      if (layer.type !== LayerType.Wms) {
        return layer;
      }

      // We migrate WMS layers
      const previous = layer.metadata as unknown as WmsMetadata030;
      return {
        type: LayerType.Wms,
        metadata: {
          id: previous.id,
          name: previous.name,
          opacity: previous.opacity,
          visible: previous.visible,
          active: previous.active,
          type: LayerType.Wms,
          projection: previous.projection,
          extent: previous.extent,
          remoteUrls: [previous.remoteUrl],
          remoteLayerName: previous.remoteLayerName,
          auth: previous.auth,
        },
      };
    });

    // We delete projection field
    const metadata: AbcProjectMetadata030 = {
      ...manifest.metadata,
      version: NEXT,
    };
    delete metadata.projection;

    return {
      manifest: {
        ...manifest,
        metadata,
        layers: upgrated,
      },
      files,
    };
  }
}
