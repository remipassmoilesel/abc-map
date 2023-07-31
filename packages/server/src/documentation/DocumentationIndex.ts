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

import * as util from 'util';
import * as path from 'path';
import { glob } from 'glob';
import { ConfigLoader, LoadConfigFunc } from '../config/ConfigLoader';
const globPromise = util.promisify(glob);

let instance: DocumentationIndex | undefined;

export class DocumentationIndex {
  public static get() {
    if (!instance) {
      instance = new DocumentationIndex(ConfigLoader.load);
    }
    return instance;
  }

  private cache: string[] = [];

  constructor(private config: LoadConfigFunc) {}

  /**
   * Returns the list of paths to documentation pages, relative to the documentation root
   */
  public async getEntries(): Promise<string[]> {
    if (!this.cache.length) {
      this.cache = await this.listEntries();
    }
    return this.cache;
  }

  private async listEntries(): Promise<string[]> {
    const { userDocumentationPath } = await this.config();

    const absolutePaths = await globPromise(userDocumentationPath + '/**/*.html', { nocase: true });
    return absolutePaths.map((absolutePath) => {
      return path.relative(userDocumentationPath, absolutePath);
    });
  }
}
