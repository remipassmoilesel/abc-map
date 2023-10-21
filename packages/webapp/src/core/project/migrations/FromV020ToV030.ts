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

import { AbcFile, LayerType } from '@abc-map/shared';
import { MigrationProject, ProjectMigration, ProjectMigrationSettings } from './typings';
import semver from 'semver';
import { ModalService } from '../../ui/ModalService';
import { ModalStatus } from '../../ui/typings';
import { AbcProjectManifest020, AbcWmsLayer020, WmsMetadata020 } from './dependencies/020-project-types';
import { Encryption } from '../../utils/Encryption';
import { AbcProjectManifest030 } from './dependencies/030-project-types';

const NEXT = '0.3.0';

/**
 * This migration add encrypted WMS remote url, even without authentication credentials
 */
export class FromV020ToV030 implements ProjectMigration<AbcProjectManifest020, AbcProjectManifest030> {
  constructor(private modalService: ModalService) {}

  public async interestedBy(manifest: AbcProjectManifest020): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(
    manifest: AbcProjectManifest020,
    files: AbcFile<Blob>[],
    settings?: ProjectMigrationSettings
  ): Promise<MigrationProject<AbcProjectManifest030>> {
    const wmsLayers = manifest.layers.filter((lay) => lay.metadata.type === LayerType.Wms) as unknown as AbcWmsLayer020[];
    const clearUrl = wmsLayers?.find((layer) => !layer.metadata.remoteUrl.startsWith('encrypted:'))?.metadata.remoteUrl;

    // No migration needed, we only upgrade version
    if (!wmsLayers.length || !clearUrl) {
      return {
        manifest: {
          ...manifest,
          metadata: {
            ...manifest.metadata,
            version: NEXT,
          },
        } as AbcProjectManifest030,
        files,
      };
    }

    if (settings?.silent) {
      return Promise.reject(new Error('Cannot prompt password if silent'));
    }

    // We prompt user for a password
    const title = 'Mot de passe';
    const message = `Désormais toutes les couches WMS sont chiffrées. Veuillez saisir un mot de passe,
      ce mot de passe vous sera demandé pour ouvrir le projet.`;
    const password = await this.modalService.createPassword(title, message);
    if (password.status !== ModalStatus.Confirmed || !password.value) {
      return Promise.reject(new Error('Password is mandatory'));
    }

    // We encrypt project then return it
    for (const layer of manifest.layers) {
      if (layer.metadata.type !== LayerType.Wms) {
        continue;
      }

      const url = (layer.metadata as unknown as WmsMetadata020).remoteUrl;
      if (!url.includes('encrypted:')) {
        (layer.metadata as unknown as WmsMetadata020).remoteUrl = await Encryption.encrypt(url, password.value);
      }
    }

    manifest.metadata.version = NEXT;
    manifest.metadata.containsCredentials = true;

    return { manifest: manifest as AbcProjectManifest030, files };
  }
}
