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

import { AbcFile, Logger } from '@abc-map/shared';
import { MigrationProject, ProjectMigration, ProjectMigrationSettings } from './typings';
import semver from 'semver';
import { ModalService } from '../../ui/ModalService';
import { ModalStatus } from '../../ui/typings';
import { DeprecatedEncryption } from './dependencies/DeprecatedEncryption';
import { prefixedTranslation } from '../../../i18n/i18n';
import { AbcProjectManifest120 } from './dependencies/120-project-types';
import { AbcProjectManifest110 } from './dependencies/110-project-types';

const NEXT = '1.2.0';

const logger = Logger.get('FromV110ToV120.ts');

/**
 * This migration removes passwords from projects
 */
export class FromV110ToV120 implements ProjectMigration<AbcProjectManifest110, AbcProjectManifest120> {
  constructor(private modals: ModalService) {}

  public async interestedBy(manifest: AbcProjectManifest110): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(
    manifest: AbcProjectManifest110,
    files: AbcFile<Blob>[],
    settings?: ProjectMigrationSettings
  ): Promise<MigrationProject<AbcProjectManifest120>> {
    let migrated: AbcProjectManifest110 = { ...manifest };

    if (DeprecatedEncryption.manifestContainsCredentials(manifest)) {
      if (settings?.silent) {
        return Promise.reject(new Error('Cannot prompt password if silent'));
      }

      // We prompt user for a password
      const t = prefixedTranslation('FromV110ToV120:');
      const title = t('End_of_project_passwords');
      const message = t('This_project_uses_an_older_Abc-Map_format');
      const witness = DeprecatedEncryption.extractWitness(manifest);
      if (!witness) {
        throw new Error('Invalid project');
      }

      const password = await this.modals.promptPassword(title, message, witness);
      if (password.status !== ModalStatus.Confirmed || !password.value) {
        throw new Error('Password is mandatory');
      }

      // Then we decrypt the project
      migrated = await DeprecatedEncryption.decryptManifest(migrated as unknown as AbcProjectManifest120, password.value);
    }

    return {
      manifest: {
        ...migrated,
        metadata: {
          ...migrated.metadata,
          version: NEXT,
        },
      },
      files,
    };
  }
}
