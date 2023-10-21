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

import { MigrationProject, MigrationsFactory } from './typings';
import { AbcFile, AbcProjectManifest, Logger } from '@abc-map/shared';
import { getMigrations } from './index';
import { ModalService } from '../../ui/ModalService';

export const logger = Logger.get('ProjectSchemaMigration.ts', 'debug');

/**
 * This class take a project and update its format to the latest version
 */
export class ProjectSchemaMigration {
  public static create(modals: ModalService) {
    return new ProjectSchemaMigration(() => getMigrations(modals));
  }

  constructor(private migrations: MigrationsFactory) {}

  public async update(manifest: AbcProjectManifest, files: AbcFile<Blob>[], silent = false): Promise<MigrationProject<AbcProjectManifest>> {
    const migrations = this.migrations();
    let result = { manifest, files };

    for (const migration of migrations) {
      if (await migration.interestedBy(result.manifest, result.files)) {
        logger.warn(`Executing project migration: ${migration.constructor.name}`);
        const options = { silent };
        result = (await migration.migrate(result.manifest, result.files, options)) as MigrationProject<AbcProjectManifest>;
      }
    }

    return result;
  }
}
