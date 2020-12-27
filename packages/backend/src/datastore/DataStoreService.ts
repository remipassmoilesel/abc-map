import { Config } from '../config/Config';
import { DataStoreDao } from './DataStoreDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ArtefactMapper } from './ArtefactMapper';
import { AbstractService } from '../services/AbstractService';
import { AbcArtefact } from '@abc-map/shared-entities';
import * as path from 'path';
import { glob } from 'glob';
import { Logger } from '../utils/Logger';
import * as util from 'util';
import { ManifestReader } from './ManifestReader';
import * as crypto from 'crypto';
const globPromise = util.promisify(glob);

export const logger = Logger.get('DatastoreService.ts', 'info');

export class DataStoreService extends AbstractService {
  public static create(config: Config, client: MongodbClient): DataStoreService {
    return new DataStoreService(config, new DataStoreDao(config, client));
  }

  constructor(private config: Config, private dao: DataStoreDao) {
    super();
  }

  public init(): Promise<void> {
    return this.dao.createIndexes();
  }

  public async save(artefact: AbcArtefact): Promise<void> {
    if (!artefact.id) {
      return Promise.reject(new Error('Id is mandatory'));
    }
    const doc = ArtefactMapper.dtoToDoc(artefact);
    return this.dao.save(doc);
  }

  public async saveAll(artefacts: AbcArtefact[]): Promise<void> {
    if (!artefacts.length) {
      return Promise.resolve();
    }

    const docs = artefacts.map(ArtefactMapper.dtoToDoc);
    return this.dao.saveAll(docs);
  }

  public async findById(id: string): Promise<AbcArtefact | undefined> {
    return this.dao.findById(id).then((res) => (res ? ArtefactMapper.docToDto(res) : undefined));
  }

  public async list(offset: number, limit: number): Promise<AbcArtefact[]> {
    const docs = await this.dao.list(offset, limit);
    return docs.map((doc) => ArtefactMapper.docToDto(doc));
  }

  public async search(query: string, limit: number, offset: number): Promise<AbcArtefact[]> {
    return this.dao.search(query, limit, offset).then((res) => res.map(ArtefactMapper.docToDto));
  }

  public getDatastorePath(): string {
    let result = this.config.datastore.path;
    if (!path.isAbsolute(result)) {
      result = path.resolve(result);
    }
    return result.replace(/\/$/, '');
  }

  public async index(): Promise<void> {
    const root = this.getDatastorePath();
    logger.info(`Indexing datastore path: ${root}`);

    const manifestPaths = await globPromise(`{${root}/**/artefact.yml,${root}/**/artefact.yaml}`, {
      nocase: true,
    });

    function hash(path: string): string {
      const hasher = crypto.createHash('sha512');
      return hasher.update(path).digest('hex');
    }

    const documents: AbcArtefact[] = [];
    for (const manifestPath of manifestPaths) {
      const manifest = await ManifestReader.read(manifestPath);
      const artefact = manifest.artefact;
      const relativePath = path.relative(this.config.datastore.path, manifest.path);
      const relativeFiles = manifest.artefact.files.map((file) => {
        const absolute = path.resolve(path.dirname(manifest.path), file);
        return path.relative(this.config.datastore.path, absolute);
      });

      const doc: AbcArtefact = {
        id: hash(relativePath),
        name: artefact.name,
        path: relativePath,
        description: artefact.description,
        keywords: artefact.keywords || [],
        links: artefact.links || [],
        license: artefact.license,
        files: relativeFiles,
      };

      documents.push(doc);
    }

    await this.dao.deleteAll();
    await this.saveAll(documents);
    logger.info('Indexing done !');
  }
}
