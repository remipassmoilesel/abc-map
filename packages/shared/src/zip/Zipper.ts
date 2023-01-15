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

import JSZip from 'jszip';
import { AbcFile } from './AbcFile';

// TODO: try https://www.npmjs.com/package/unzipit ?

export class Zipper<T extends Blob | Buffer> {
  public static forNodeJS(): Zipper<Buffer> {
    return new Zipper<Buffer>('nodebuffer');
  }

  public static forBrowser(): Zipper<Blob> {
    return new Zipper<Blob>('blob');
  }

  constructor(private binaryFormat: 'blob' | 'nodebuffer') {}

  public zipFiles(files: AbcFile<T>[]): Promise<T> {
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.path, file.content));
    return zip.generateAsync({ type: this.binaryFormat, compression: 'DEFLATE' }) as Promise<T>;
  }

  public async unzip(content: T): Promise<AbcFile<T>[]> {
    const zip = new JSZip();
    await zip.loadAsync(content);

    const result: AbcFile<T>[] = [];
    for (const name in zip.files) {
      const file = await zip.file(name)?.async(this.binaryFormat);

      // "name" can represent a directory
      if (file) {
        result.push({ path: name, content: file as T });
      }
    }

    return result;
  }
}
