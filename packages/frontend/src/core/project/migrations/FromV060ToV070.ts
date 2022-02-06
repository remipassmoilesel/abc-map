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
import { MigratedProject, ProjectMigration } from './typings';
import semver from 'semver';
import { AbcProjectManifest060 } from './old-typings/project-060';
import { nanoid } from 'nanoid';

const NEXT = '0.7.0';

const logger = Logger.get('FromV060ToV070.ts');

/**
 * This migration moves legend to layouts and views
 */
export class FromV060ToV070 implements ProjectMigration {
  public async interestedBy(manifest: AbcProjectManifest): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(_manifest: AbcProjectManifest, files: AbcFile[]): Promise<MigratedProject> {
    const manifest = _manifest as AbcProjectManifest060;

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
