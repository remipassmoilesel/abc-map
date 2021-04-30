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

import { AbcProject, ManifestName } from '@abc-map/shared-entities';
import { Zipper } from '../zip';
import { BlobIO } from '../utils/BlobIO';

export class ProjectHelper {
  public static async extractManifest(blob: Blob): Promise<AbcProject> {
    const files = await Zipper.unzip(blob);
    const manifest = files.find((f) => f.path.endsWith(ManifestName));
    if (!manifest) {
      return Promise.reject(new Error('No manifest found'));
    }
    const content = await BlobIO.asString(manifest.content);
    return JSON.parse(content);
  }
}
