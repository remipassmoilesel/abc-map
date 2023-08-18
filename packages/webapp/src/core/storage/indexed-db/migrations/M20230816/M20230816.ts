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

import { IndexedDbMigration, StorageMigrationContext } from '../IndexedDbMigration';
import { IDBProjectMetadataV0 } from '../typings/ProjectIDBEntryV0';
import { ObjectStore } from '../../client/ObjectStore';
import { ProjectIDBEntry } from '../../projects/ProjectIDBEntry';
import { Logger } from '@abc-map/shared';

const NEXT = 3;

const logger = Logger.get('M20230816.ts');

/**
 * This migration removes "containsCredentials" field
 */
export class M20230816 implements IndexedDbMigration {
  public getName(): string {
    return 'M20230816';
  }

  public async process(context: StorageMigrationContext): Promise<void> {
    const { client } = context;

    // Projects
    const projects = await client.getAll<ProjectIDBEntry>(ObjectStore.Projects);
    const migratedProjects = projects
      .filter((entry) => (entry.value.version ?? 0) < NEXT)
      .map<ProjectIDBEntry>((entry) => {
        const result: ProjectIDBEntry = {
          version: NEXT,
          metadata: {
            ...entry.value.metadata,
          },
          view: entry.value.view,
          layouts: entry.value.layouts,
          sharedViews: entry.value.sharedViews,
          layerIds: entry.value.layerIds,
        };

        // This field has not been removed in previous migration
        const metadata = result.metadata as Partial<IDBProjectMetadataV0>;
        if (typeof metadata.containsCredentials !== 'undefined') {
          delete metadata.containsCredentials;
        }

        return result;
      });

    if (migratedProjects.length) {
      await client.putAll<ProjectIDBEntry>(
        ObjectStore.Projects,
        migratedProjects.map((entry) => ({ key: entry.metadata.id, value: entry }))
      );
    }
  }
}
