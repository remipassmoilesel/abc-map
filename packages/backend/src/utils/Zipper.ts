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

import * as JSZip from 'jszip';
import { Logger } from '../utils/Logger';
import { AbcFile } from './AbcFile';

const logger = Logger.get('Zipper.ts');

export class Zipper {
  public static zipFiles(files: AbcFile[]): Promise<Buffer> {
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.path, file.content));
    return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  }

  public static async unzip(content: Buffer): Promise<AbcFile[]> {
    const zip = new JSZip();
    await zip.loadAsync(content);

    const result: AbcFile[] = [];
    for (const name in zip.files) {
      const file = await zip.file(name)?.async('nodebuffer');
      if (file) {
        result.push({ path: name, content: file });
      } else {
        logger.error(`Unable to read file: ${name}`);
      }
    }
    return result;
  }
}
