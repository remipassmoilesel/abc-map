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
import { MigrationProject, ProjectMigration } from './typings';
import semver from 'semver';
import { AbcProjectManifest090 } from './dependencies/090-project-types';
import { AbcProjectManifest110 } from './dependencies/110-project-types';

const NEXT = '1.0.0';

const logger = Logger.get('FromV090ToV100.ts');

/**
 * This migration:
 * - adds textFrames style options
 */
export class FromV090ToV100 implements ProjectMigration<AbcProjectManifest090, AbcProjectManifest110> {
  public async interestedBy(manifest: AbcProjectManifest090): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(manifest: AbcProjectManifest090, files: AbcFile<Blob>[]): Promise<MigrationProject<AbcProjectManifest110>> {
    const defaultStyle = {
      withBorders: true,
      withShadows: true,
      background: '#FFFFFF',
    };

    const sharedViews = manifest.sharedViews.list.map((view) => ({
      ...view,
      textFrames: view.textFrames.map((textFrame) => ({ ...textFrame, style: { ...defaultStyle } })),
    }));

    const layouts = manifest.layouts.map((layout) => ({
      ...layout,
      textFrames: layout.textFrames.map((textFrame) => ({ ...textFrame, style: { ...defaultStyle } })),
    }));

    return {
      manifest: {
        ...manifest,
        sharedViews: {
          ...manifest.sharedViews,
          list: sharedViews,
        },
        layouts,
        metadata: {
          ...manifest.metadata,
          version: NEXT,
        },
      },
      files,
    };
  }
}
