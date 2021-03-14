import { Config } from '../config/Config';
import { ProjectDao } from './ProjectDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { ProjectMapper } from './ProjectMapper';
import { AbstractService } from '../services/AbstractService';
import { CompressedProject } from './CompressedProject';

export class ProjectService extends AbstractService {
  public static create(config: Config, client: MongodbClient): ProjectService {
    return new ProjectService(config, new ProjectDao(config, client));
  }

  constructor(private config: Config, private dao: ProjectDao) {
    super();
  }

  public async save(userId: string, project: CompressedProject): Promise<void> {
    if (!userId) {
      throw new Error('User id is mandatory');
    }
    const doc = ProjectMapper.dtoToDoc(project.metadata, userId);
    return Promise.all([this.dao.saveMetadata(doc), this.dao.saveCompressedFile(project.metadata.id, project.project)]).then(() => undefined);
  }

  public async findById(id: string): Promise<CompressedProject | undefined> {
    return Promise.all([this.dao.findMetadataById(id), this.dao.findCompressedFileById(id)]).then(([metadata, project]) => {
      if (!metadata || !project) {
        return;
      }

      return {
        metadata: ProjectMapper.docToDto(metadata),
        project,
      };
    });
  }

  public async list(userId: string, offset: number, limit: number): Promise<AbcProjectMetadata[]> {
    const docs = await this.dao.list(userId, offset, limit);
    return docs.map((doc) => ProjectMapper.docToDto(doc));
  }
}
