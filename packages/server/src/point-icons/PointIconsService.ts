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

import { AbstractService } from '../services/AbstractService';
import { Config } from '../config/Config';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('PointIconsService.ts');

export class PointIconsService extends AbstractService {
  public static create(config: Config) {
    return new PointIconsService(config);
  }

  private cache: Map<string, string> = new Map();

  constructor(private config: Config) {
    super();
  }

  public async getIcons(names: string[]): Promise<{ name: string; content: string }[]> {
    const { pointIconsPath } = this.config;

    const fileReads: Promise<void>[] = [];
    const result: { name: string; content: string }[] = [];

    for (const name of names) {
      const inCache = this.cache.get(name);
      if (typeof inCache === 'string') {
        result.push({ name, content: inCache });
      } else {
        fileReads.push(
          fs
            .readFile(path.resolve(pointIconsPath, name))
            .then((buffer) => {
              const content = buffer.toString('utf-8');
              this.cache.set(name, content);
              result.push({ name, content });
            })
            .catch((err) => logger.error(`Invalid icon: ${name}`, err))
        );
      }
    }
    await Promise.all(fileReads);

    return result;
  }
}
