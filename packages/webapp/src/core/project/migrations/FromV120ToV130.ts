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

import { AbcFile, AbcProjectManifest, Logger } from '@abc-map/shared';
import { MigrationProject, ProjectMigration } from './typings';
import semver from 'semver';
import { AbcProjectManifest120, AbcProjectMetadata120 } from './dependencies/120-project-types';

const NEXT = '1.3.0';

const logger = Logger.get('FromV120ToV130.ts');

/**
 * This migration add "abcMapAttributionsEnabled" layout metadata
 */
export class FromV120ToV130 implements ProjectMigration<AbcProjectManifest120, AbcProjectManifest> {
  public async interestedBy(manifest: AbcProjectManifest120): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(manifest: AbcProjectManifest120, files: AbcFile<Blob>[]): Promise<MigrationProject<AbcProjectManifest>> {
    const result: MigrationProject<AbcProjectManifest> = {
      manifest: {
        ...manifest,
        metadata: {
          ...manifest.metadata,
          version: NEXT,
        },
        layouts: {
          list: manifest.layouts,
          abcMapAttributionsEnabled: true,
        },
      },
      files,
    };

    // This field has not been removed in previous migration
    const metadata = result.manifest.metadata as Partial<AbcProjectMetadata120>;
    if (typeof metadata.containsCredentials !== 'undefined') {
      delete metadata.containsCredentials;
    }

    return result;
  }
}
