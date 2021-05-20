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

import { Config } from '../config/Config';
import { ProjectDao } from './ProjectDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { AbcProjectMetadata, CompressedProject, NodeBinary } from '@abc-map/shared';
import { ProjectMapper } from './ProjectMapper';
import { AbstractService } from '../services/AbstractService';

export class ProjectService extends AbstractService {
  public static create(config: Config, client: MongodbClient): ProjectService {
    return new ProjectService(config, new ProjectDao(client));
  }

  constructor(private config: Config, private dao: ProjectDao) {
    super();
  }

  public async save(ownerId: string, project: CompressedProject<NodeBinary>): Promise<void> {
    if (!ownerId || typeof ownerId !== 'string') {
      throw new Error('Owner id is mandatory');
    }

    const doc = ProjectMapper.dtoToDoc(project.metadata, ownerId);
    return Promise.all([this.dao.saveMetadata(doc), this.dao.saveCompressedFile(project.metadata.id, project.project)]).then(() => undefined);
  }

  public async findById(id: string): Promise<CompressedProject<NodeBinary> | undefined> {
    const metadata = await this.dao.findMetadataById(id);
    if (!metadata) {
      return;
    }

    const compressed = await this.dao.findCompressedFileById(id);
    return {
      metadata: ProjectMapper.docToDto(metadata),
      project: compressed,
    };
  }

  public async list(userId: string, offset: number, limit: number): Promise<AbcProjectMetadata[]> {
    const docs = await this.dao.list(userId, offset, limit);
    return docs.map((doc) => ProjectMapper.docToDto(doc));
  }

  public async deleteById(projectId: string): Promise<void> {
    await Promise.all([this.dao.deleteMetadataById(projectId), this.dao.deleteCompressedFileById(projectId)]);
  }
}
