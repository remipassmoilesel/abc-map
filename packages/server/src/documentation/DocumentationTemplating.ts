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
 *
 *
 *
 */

import { DocumentationIndex } from './DocumentationIndex';
import { promises as fs } from 'fs';
import { Config } from '../config/Config';
import * as path from 'path';

export const StartMark = '%%%append-to-body%%%';
export const EndMark = '%%%end-append-to-body%%%';

const replaceRegexp = new RegExp(StartMark + '[\\s\\S]*' + EndMark, 'm');

export class DocumentationTemplating {
  public static create(config: Config): DocumentationTemplating {
    return new DocumentationTemplating(config, DocumentationIndex.get());
  }

  constructor(private config: Config, private index: DocumentationIndex) {}

  public async templatePages() {
    const docRoot = this.config.userDocumentationPath;
    const toTemplate = this.config.userDocumentation?.appendToBody;
    if (!toTemplate) {
      return;
    }

    const pages = await this.index.getEntries();
    for (const pagePath of pages) {
      const absolutePath = path.resolve(docRoot, pagePath);
      const page = await fs.readFile(absolutePath);

      const originalContent = page.toString('utf8');
      const templated = originalContent.replace(replaceRegexp, StartMark + '  ' + toTemplate + '  ' + EndMark);
      if (originalContent !== templated) {
        await fs.writeFile(absolutePath, templated);
      }
    }
  }
}
