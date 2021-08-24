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

import { MigratedProject, MigrationsFactory } from './typings';
import { FromV010ToV020 } from './FromV010ToV020';
import { AbcFile, AbcProjectManifest } from '@abc-map/shared';

/**
 * This class take a project and update its format to the latest version
 */
export class ProjectUpdater {
  public static create() {
    // Migrations must be passed in chronological order
    return new ProjectUpdater(() => [new FromV010ToV020()]);
  }

  constructor(private migrations: MigrationsFactory) {}

  public async update(manifest: AbcProjectManifest, files: AbcFile[]): Promise<MigratedProject> {
    const migrations = this.migrations();
    let result = { manifest, files };

    for (const migration of migrations) {
      if (await migration.interestedBy(manifest, files)) {
        result = await migration.migrate(manifest, files);
      }
    }

    return result;
  }
}
