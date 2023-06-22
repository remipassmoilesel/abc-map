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

import { AbcFile, AbcLayout, AbcProjectManifest, AbcProjectMetadata, LayoutFormats, Logger } from '@abc-map/shared';
import { MigrationProject, ProjectMigration } from './typings';
import { LayoutFormat040 } from './dependencies/040-project';
import semver from 'semver';

const NEXT = '0.5.0';

const logger = Logger.get('FromV040ToV050.ts');

const v040LayoutNameMapper = (name: string | undefined): string => {
  switch (name?.trim()) {
    case 'A5 Portrait':
      return LayoutFormats.A5_PORTRAIT.id;
    case 'A5 Paysage':
      return LayoutFormats.A5_LANDSCAPE.id;
    case 'A4 Portrait':
      return LayoutFormats.A4_PORTRAIT.id;
    case 'A4 Paysage':
      return LayoutFormats.A4_LANDSCAPE.id;
    case 'A3 Portrait':
      return LayoutFormats.A3_PORTRAIT.id;
    case 'A3 Paysage':
      return LayoutFormats.A3_LANDSCAPE.id;
    default:
      logger.error('Invalid format name: ', name);
      return LayoutFormats.A4_LANDSCAPE.id;
  }
};

/**
 * This migration rename layout names to ids
 */
export class FromV040ToV050 implements ProjectMigration {
  public async interestedBy(manifest: AbcProjectManifest): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(manifest: AbcProjectManifest, files: AbcFile<Blob>[]): Promise<MigrationProject> {
    const layouts: AbcLayout[] = manifest.layouts.map((layout) => {
      // There was a mistake in migrations, some projects were migrated without version upgrade
      if (layout.format.id) {
        return layout;
      }

      const format: LayoutFormat040 = { ...layout.format };
      const id = v040LayoutNameMapper(format.name);

      // We remove old name, set new id
      delete format.name;
      format.id = id;

      return { ...layout, format };
    });

    const metadata: AbcProjectMetadata = { ...manifest.metadata, version: NEXT };
    return {
      manifest: {
        ...manifest,
        metadata,
        layouts,
      },
      files,
    };
  }
}
