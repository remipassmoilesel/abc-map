import { Config } from '../config/Config';
import { ProjectDao } from './ProjectDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { ProjectMapper } from './ProjectMapper';
import { AbstractService } from '../services/AbstractService';
import { CompressedProject } from './CompressedProject';

export class ProjectService extends AbstractService {
  public static create(config: Config, client: MongodbClient): ProjectService {
    return new ProjectService(config, new ProjectDao(client));
  }

  constructor(private config: Config, private dao: ProjectDao) {
    super();
  }

  public async save(ownerId: string, project: CompressedProject): Promise<void> {
    if (!ownerId) {
      throw new Error('Owner id is mandatory');
    }
    const doc = ProjectMapper.dtoToDoc(project.metadata, ownerId);
    return Promise.all([this.dao.saveMetadata(doc), this.dao.saveCompressedFile(project.metadata.id, project.project)]).then(() => undefined);
  }

  public async findById(id: string): Promise<CompressedProject | undefined> {
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
