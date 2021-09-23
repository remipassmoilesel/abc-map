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

import { AbcFile, AbcProjectManifest, AbcWmsLayer, LayerType } from '@abc-map/shared';
import { MigratedProject, ProjectMigration } from './typings';
import semver from 'semver';
import { ModalService } from '../../ui/ModalService';
import { ModalStatus } from '../../ui/typings';
import { Encryption } from '../../utils/Encryption';

const NEXT = '0.3.0';

/**
 * This migration add encrypted wms remote url, even without authentication credentials
 */
export class FromV020ToV030 implements ProjectMigration {
  constructor(private modalService: ModalService) {}

  public async interestedBy(manifest: AbcProjectManifest): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(manifest: AbcProjectManifest, files: AbcFile[]): Promise<MigratedProject> {
    const hasWmsLayer = manifest.layers.find((lay) => lay.metadata.type === LayerType.Wms) as AbcWmsLayer | undefined;
    const urlIsEncrypted = hasWmsLayer?.metadata.remoteUrl.startsWith('encrypted:');

    // No migration needed, we only upgrade version
    if (!hasWmsLayer || urlIsEncrypted) {
      return {
        manifest: {
          ...manifest,
          metadata: {
            ...manifest.metadata,
            version: NEXT,
          },
        },
        files,
      };
    }

    // We prompt user for a password
    const title = 'Mot de passe';
    const message = `Désormais toutes les couches WMS sont chiffrées. Veuillez saisir un mot de passe,
      ce mot de passe vous sera demandé pour ouvrir le projet.`;
    const password = await this.modalService.setPasswordModal(title, message);
    if (password.status !== ModalStatus.Confirmed || !password.value) {
      return Promise.reject(new Error('Password is mandatory'));
    }

    // We encrypt project then return it
    const encrypted = await Encryption.encryptManifest(manifest, password.value);
    return {
      manifest: {
        ...encrypted,
        metadata: {
          ...encrypted.metadata,
          version: NEXT,
        },
      },
      files,
    };
  }
}
