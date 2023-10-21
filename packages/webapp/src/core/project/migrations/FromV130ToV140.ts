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

import { AbcFile, AbcLayer, AbcProjectManifest, LayerType, Logger, PredefinedLayerModel } from '@abc-map/shared';
import { MigrationProject, ProjectMigration, ProjectMigrationSettings } from './typings';
import semver from 'semver';
import { ModalService } from '../../ui/ModalService';
import { AbcProjectManifest130 } from './dependencies/130-project-types';
import { prefixedTranslation } from '../../../i18n/i18n';

const NEXT = '1.4.0';

const logger = Logger.get('FromV130ToV140.ts');

const deprecatedModels = ['StamenToner', 'StamenTonerLite', 'StamenTerrain', 'StamenWatercolor'];

const t = prefixedTranslation('FromV130ToV140:');

/**
 * This migration replaces Stamen predefined layers by OSM layers.
 */
export class FromV130ToV140 implements ProjectMigration<AbcProjectManifest130, AbcProjectManifest> {
  constructor(private modals: ModalService) {}

  public async interestedBy(manifest: AbcProjectManifest130): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(
    manifest: AbcProjectManifest130,
    files: AbcFile<Blob>[],
    settings?: ProjectMigrationSettings
  ): Promise<MigrationProject<AbcProjectManifest>> {
    // We will warn user once
    let warned = false;
    const layers: AbcLayer[] = manifest.layers.map((layer) => {
      const layerIsDeprecated = LayerType.Predefined === layer.type && deprecatedModels.includes(layer.metadata.model);
      if (layerIsDeprecated) {
        if (!warned && !settings?.silent) {
          this.modals
            .warning(
              t('Changes_have_been_made_to_your_project'),
              `<div class="mb-4">${t('Stamen_layers_are_no_longer_available_as_before')}</div>
               <div class="fw-bold">${t('The_Stamen_layers_in_your_project_have_been_replaced')}</div>`
            )
            .catch((err) => logger.error('Modal error: ', err));
          warned = true;
        }

        return {
          ...layer,
          metadata: {
            ...layer.metadata,
            model: PredefinedLayerModel.OSM,
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
