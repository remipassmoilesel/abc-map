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

import { AbcFile, AbcProjectManifest } from '@abc-map/shared';
import { Views } from '../../geo/Views';
import { MigratedProject, ProjectMigration } from './typings';
import semver from 'semver';

/**
 * This migration add a view in project manifest
 */
export class FromV010ToV020 implements ProjectMigration {
  public async interestedBy(manifest: AbcProjectManifest): Promise<boolean> {
    const version = manifest.metadata.version;
    const isV1 = version === '0.1';
    return isV1 || semver.lt(version, '0.2.0');
  }

  public async migrate(manifest: AbcProjectManifest, files: AbcFile<Blob>[]): Promise<MigratedProject> {
    return {
      manifest: {
        ...manifest,
        metadata: {
          ...manifest.metadata,
          version: '0.2.0',
        },
        // We set view
        view: Views.defaultView(),
      },
      files: files,
    };
  }
}
