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

import { AbcFile, Logger } from '@abc-map/shared';
import { MigrationProject, ProjectMigration } from './typings';
import semver from 'semver';
import { AbcProjectManifest060 } from './dependencies/060-project-types';
import { nanoid } from 'nanoid';
import { AbcProjectManifest070 } from './dependencies/070-project-types';

const NEXT = '0.7.0';

const logger = Logger.get('FromV060ToV070.ts');

/**
 * This migration moves legend to layouts and views
 */
export class FromV060ToV070 implements ProjectMigration<AbcProjectManifest060, AbcProjectManifest070> {
  public async interestedBy(manifest: AbcProjectManifest060): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(manifest: AbcProjectManifest060, files: AbcFile<Blob>[]): Promise<MigrationProject<AbcProjectManifest070>> {
    const layouts = manifest.layouts.map((lay) => ({
      ...lay,
      legend: {
        ...manifest.legend,
        id: nanoid(),
        items: manifest.legend.items.map((item) => ({ ...item, id: nanoid() })),
      },
    }));

    const sharedViews = manifest.sharedViews.map((view) => ({
      ...view,
      legend: {
        ...manifest.legend,
        id: nanoid(),
        items: manifest.legend.items.map((item) => ({ ...item })),
      },
    }));

    delete (manifest as Partial<AbcProjectManifest060>).legend;

    return {
      manifest: {
        ...manifest,
        layouts,
        sharedViews,
        metadata: {
          ...manifest.metadata,
          version: NEXT,
        },
      },
      files,
    };
  }
}
