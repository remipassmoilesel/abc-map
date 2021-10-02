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

import { AbstractService } from '../services/AbstractService';
import { MongodbClient } from '../mongodb/MongodbClient';
import { Config } from '../config/Config';
import { ProjectionDao } from './ProjectionDao';
import { ProjectionSource } from './ProjectionSource';
import { ProjectionDocument } from './ProjectionDocument';
import { Logger, normalizedProjectionName, ProjectionDto } from '@abc-map/shared';
import { ProjectionMapper } from './ProjectionMapper';

export const logger = Logger.get('ProjectionService.ts', 'info');

export class ProjectionService extends AbstractService {
  public static create(config: Config, mongodb: MongodbClient): ProjectionService {
    const dao = new ProjectionDao(config, mongodb);
    const projectionSource = new ProjectionSource();
    return new ProjectionService(dao, projectionSource);
  }

  constructor(private dao: ProjectionDao, private projectionSource: ProjectionSource) {
    super();
  }

  public init(): Promise<void> {
    return this.dao.init();
  }

  public async findByCode(code: string): Promise<ProjectionDto | undefined> {
    const doc = await this.dao.findByCode(code);
    if (doc) {
      return ProjectionMapper.docToDto(doc);
    }
  }

  public async index(bufferSize = 200): Promise<void> {
    // We init source first
    await this.projectionSource.init();

    // We check if projections already imported
    const fileEntries = this.projectionSource.count();
    const dbEntries = await this.dao.count();
    if (fileEntries <= dbEntries) {
      logger.info('Projections up to date');
      return;
    }

    logger.info('Indexing projections ...');

    // We iterate zip entries
    const files = this.projectionSource.getFiles();
    let buffer: ProjectionDocument[] = [];
    for (const [i, entry] of files.entries()) {
      // We buffer matching projections
      const code = normalizedProjectionName(entry.path);
      if (code) {
        const json = JSON.parse(entry.content.toString('utf8'));
        buffer.push({ ...json, _id: entry.path, code });
      }

      // Then we write buffer
      if (buffer.length >= bufferSize || i === files.length) {
        await this.dao.upsertByCode(buffer);
        buffer = [];
      }
    }

    if (buffer.length) {
      await this.dao.upsertByCode(buffer);
    }

    logger.info(`${files.length} projections indexed`);
  }
}
