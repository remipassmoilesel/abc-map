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

import * as path from 'path';
import { AbcFile, Zipper } from '@abc-map/shared';
import { promises as fs } from 'fs';

export class ProjectionSource {
  private projectionArchive = path.resolve(__dirname, '../../resources/projections.zip');
  private files?: AbcFile<Buffer>[];

  public async init() {
    const buffer = await fs.readFile(this.projectionArchive);
    this.files = await Zipper.forNodeJS().unzip(buffer);
  }

  public count(): number {
    if (!this.files?.length) {
      throw new Error('ProjectionSource not initialized');
    }

    return this.files.length || 0;
  }

  public getFiles(): AbcFile<Buffer>[] {
    if (!this.files?.length) {
      throw new Error('ProjectionSource not initialized');
    }

    return this.files;
  }
}
