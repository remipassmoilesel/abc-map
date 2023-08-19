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

import { promises as fs } from 'fs';
import * as path from 'path';

export class TestData {
  public async getSampleArchive(): Promise<Buffer> {
    return this.readFile('./archive.zip');
  }

  private async readFile(name: string): Promise<Buffer> {
    const absPath = path.resolve(__dirname, '..', '..', 'test-data', name);
    return fs.readFile(absPath);
  }
}
