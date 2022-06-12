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

import { AbcProjectManifest } from '../AbcProjectManifest';
import { Zipper } from '../../zip';
import { BlobIO } from '../../frontend/blob/BlobIO';
import { ProjectConstants } from '../constants/ProjectConstants';

export class ProjectHelper<T extends Blob | Buffer = Blob | Buffer> {
  public static forFrontend(): ProjectHelper<Blob> {
    return new ProjectHelper<Blob>('blob');
  }

  public static forBackend(): ProjectHelper<Buffer> {
    return new ProjectHelper<Buffer>('nodebuffer');
  }

  constructor(private binaryFormat: 'nodebuffer' | 'blob') {}

  public async extractManifest(zip: T): Promise<AbcProjectManifest> {
    const files = await new Zipper(this.binaryFormat).unzip(zip);
    const manifest = files.find((f) => f.path.endsWith(ProjectConstants.ManifestName));
    if (!manifest) {
      return Promise.reject(new Error('No manifest found'));
    }

    let content: string;
    if (this.binaryFormat === 'blob') {
      content = await BlobIO.asString(manifest.content as Blob);
    } else {
      content = (manifest.content as Buffer).toString('utf-8');
    }

    return JSON.parse(content);
  }
}
