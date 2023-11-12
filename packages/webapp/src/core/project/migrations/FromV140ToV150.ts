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

import { AbcFile, AbcLayer, AbcProjectManifest, LayerType, Logger, StyleProperties } from '@abc-map/shared';
import { MigrationProject, ProjectMigration } from './typings';
import semver from 'semver';
import { AbcProjectManifest130 } from './dependencies/130-project-types';

const NEXT = '1.5.0';

const logger = Logger.get('FromV140ToV150.ts');

/**
 * This migration renames icons.
 */
export class FromV140ToV150 implements ProjectMigration<AbcProjectManifest130, AbcProjectManifest> {
  public async interestedBy(manifest: AbcProjectManifest130): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(manifest: AbcProjectManifest, files: AbcFile<Blob>[]): Promise<MigrationProject<AbcProjectManifest>> {
    const layers: AbcLayer[] = manifest.layers.map((layer) => {
      if (LayerType.Vector === layer.type) {
        return {
          ...layer,
          features: {
            ...layer.features,
            features: layer.features.features.map((feature) => {
              if (feature.properties && feature.properties[StyleProperties.PointIcon]) {
                return {
                  ...feature,
                  properties: {
                    ...feature.properties,
                    [StyleProperties.PointIcon]: feature.properties[StyleProperties.PointIcon].replace('.inline.svg', '.svg'),
                  },
                };
              }

              return feature;
            }),
          },
        };
      }

      return layer;
    });

    const result: MigrationProject<AbcProjectManifest> = {
      manifest: {
        ...manifest,
        metadata: {
          ...manifest.metadata,
          version: NEXT,
        },
        layers,
      },
      files,
    };

    return result;
  }
}
