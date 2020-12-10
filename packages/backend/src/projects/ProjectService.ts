import { Config } from '../config/Config';
import { ProjectDao } from './ProjectDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { AbcProject } from '@abc-map/shared-entities';
import { ObjectID } from 'mongodb';
import { ProjectMapper } from './ProjectMapper';

export class ProjectService {
  public static create(config: Config, client: MongodbClient): ProjectService {
    return new ProjectService(config, new ProjectDao(config, client));
  }

  constructor(private config: Config, private dao: ProjectDao) {}

  public async save(project: AbcProject): Promise<void> {
    if (!project.id) {
      project.id = new ObjectID().toHexString();
    }
    const doc = ProjectMapper.dtoToDoc(project);
    return this.dao.save(doc);
  }

  public async findById(id: string): Promise<AbcProject | undefined> {
    return this.dao.findById(new ObjectID(id)).then((res) => (res ? ProjectMapper.docToDto(res) : undefined));
  }

  public async list(offset: number, limit: number): Promise<AbcProject[]> {
    const docs = await this.dao.list(offset, limit);
    return docs.map((doc) => ProjectMapper.docToDto(doc));
  }
}
