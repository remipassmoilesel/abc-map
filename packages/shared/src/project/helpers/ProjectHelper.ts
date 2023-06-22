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
import { AbcFile, Zipper } from '../../zip';
import { BlobIO } from '../../webapp/blob/BlobIO';
import { ProjectConstants } from '../constants/ProjectConstants';
import { CompressedProject } from '../CompressedProject';

export class ProjectHelper<T extends Blob | Buffer = Blob | Buffer> {
  public static forBrowser(): ProjectHelper<Blob> {
    return new ProjectHelper<Blob>('blob');
  }

  public static forNodeJS(): ProjectHelper<Buffer> {
    return new ProjectHelper<Buffer>('nodebuffer');
  }

  constructor(private binaryFormat: 'nodebuffer' | 'blob') {}

  public async extractManifest(zip: T): Promise<AbcProjectManifest> {
    const files = await new Zipper<T>(this.binaryFormat).unzip(zip);
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

  public async updateManifest(zip: T, manifest: AbcProjectManifest): Promise<CompressedProject<T>> {
    const zipper = new Zipper<T>(this.binaryFormat);
    let files: AbcFile<T>[] = await zipper.unzip(zip);
    // We remove previous manifest
    files = files.filter((f) => !f.path.endsWith(ProjectConstants.ManifestName));
    // We add new one
    let manifestContent: T;
    if (this.binaryFormat === 'nodebuffer') {
      manifestContent = Buffer.from(JSON.stringify(manifest)) as T;
    } else {
      manifestContent = new Blob([JSON.stringify(manifest)], { type: 'application/json' }) as T;
    }

    files = files.concat([{ path: ProjectConstants.ManifestName, content: manifestContent }]);

    return { metadata: manifest.metadata, project: await zipper.zipFiles(files) };
  }
}
