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
import { DataStoreDao } from './DataStoreDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ArtefactMapper } from './ArtefactMapper';
import { AbstractService } from '../services/AbstractService';
import { AbcArtefact } from '@abc-map/shared';
import * as path from 'path';
import { glob } from 'glob';
import { Logger } from '@abc-map/shared';
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
    return this.dao.init();
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

  public async list(limit: number, offset = 0): Promise<AbcArtefact[]> {
    const docs = await this.dao.list(limit, offset);
    return docs.map((doc) => ArtefactMapper.docToDto(doc));
  }

  public async search(query: string, limit: number, offset = 0): Promise<AbcArtefact[]> {
    return this.dao.search(query, limit, offset).then((res) => res.map(ArtefactMapper.docToDto));
  }

  public async countArtefacts(): Promise<number> {
    return this.dao.count();
  }

  public getRoot(): string {
    let result = this.config.datastore.path;
    if (!path.isAbsolute(result)) {
      result = path.resolve(result);
    }
    return result.replace(/\/$/, '');
  }

  public async index(): Promise<void> {
    const root = this.getRoot();
    logger.info(`Indexing datastore path: ${root}`);

    const manifestPaths = await globPromise(`{${root}/**/artefact.yml,${root}/**/artefact.yaml}`, {
      nocase: true,
    });

    function hash(path: string): string {
      const hasher = crypto.createHash('sha512');
      return hasher.update(path).digest('hex');
    }

    const datastorePath = this.config.datastore.path;
    function relativePath(manifestPath: string, filePath: string): string {
      const absolute = path.resolve(path.dirname(manifestPath), filePath);
      return path.relative(datastorePath, absolute);
    }

    const documents: AbcArtefact[] = [];
    for (const manifestPath of manifestPaths) {
      const manifest = await ManifestReader.read(manifestPath);
      const artefact = manifest.artefact;
      const artefactPath = path.relative(datastorePath, manifest.path);
      const files = manifest.artefact.files.map((file) => relativePath(manifest.path, file));
      const license = relativePath(manifest.path, manifest.artefact.license);

      const doc: AbcArtefact = {
        id: hash(artefactPath),
        name: artefact.name,
        description: artefact.description,
        keywords: artefact.keywords || [],
        link: artefact.link,
        license,
        path: artefactPath,
        files,
      };

      documents.push(doc);
    }

    await this.dao.deleteAll();
    await this.saveAll(documents);
    logger.info('Indexing done !');
  }
}
