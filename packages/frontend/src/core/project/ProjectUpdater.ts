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

import { MigratedProject, MigrationsFactory } from './migrations/typings';
import { FromV010ToV020 } from './migrations/FromV010ToV020';
import { AbcFile, AbcProjectManifest } from '@abc-map/shared';
import { FromV020ToV030 } from './migrations/FromV020ToV030';
import { ModalService } from '../ui/ModalService';

/**
 * This class take a project and update its format to the latest version
 */
export class ProjectUpdater {
  public static create(modal: ModalService) {
    // Migrations must be passed in chronological order
    return new ProjectUpdater(() => [new FromV010ToV020(), new FromV020ToV030(modal)]);
  }

  constructor(private migrations: MigrationsFactory) {}

  public async update(manifest: AbcProjectManifest, files: AbcFile[]): Promise<MigratedProject> {
    const migrations = this.migrations();
    let result = { manifest, files };

    for (const migration of migrations) {
      if (await migration.interestedBy(result.manifest, result.files)) {
        result = await migration.migrate(result.manifest, result.files);
      }
    }

    return result;
  }
}
