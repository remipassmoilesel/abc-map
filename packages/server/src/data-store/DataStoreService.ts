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

import { Config } from '../config/Config';
import { ArtefactDao } from './ArtefactDao';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ArtefactMapper } from './ArtefactMapper';
import { AbstractService } from '../services/AbstractService';
import { AbcArtefact, ArtefactFilter, Language } from '@abc-map/shared';
import * as path from 'path';
import { Logger } from '@abc-map/shared';
import * as crypto from 'crypto';
import { ArtefactDocument } from './ArtefactDocument';
import { MongoI18nMapper } from '../mongodb/MongodbI18n';
import { DataStoreScanner } from './DataStoreScanner';

export const logger = Logger.get('DatastoreService.ts', 'info');

export class DataStoreService extends AbstractService {
  public static create(config: Config, client: MongodbClient): DataStoreService {
    const dao = new ArtefactDao(config, client);
    const scanner = DataStoreScanner.create();
    return new DataStoreService(config, dao, scanner);
  }

  constructor(private config: Config, private dao: ArtefactDao, private scanner: DataStoreScanner) {
    super();
  }

  public init(): Promise<void> {
    return this.dao.init();
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

  public async list(limit: number, offset = 0, filter: ArtefactFilter = ArtefactFilter.All): Promise<AbcArtefact[]> {
    const docs = await this.dao.list(limit, offset, filter);
    return docs.map((doc) => ArtefactMapper.docToDto(doc));
  }

  public async search(query: string, lang: Language, limit: number, offset = 0, filter: ArtefactFilter = ArtefactFilter.All): Promise<AbcArtefact[]> {
    const mongoLang = MongoI18nMapper.langToMongo(lang);
    return this.dao.search(query, mongoLang, limit, offset, filter).then((res) => res.map(ArtefactMapper.docToDto));
  }

  public async countArtefacts(filter: ArtefactFilter = ArtefactFilter.All): Promise<number> {
    return this.dao.count(filter);
  }

  public getRoot(): string {
    let result = this.config.datastore.path.trim();
    if (!path.isAbsolute(result)) {
      result = path.resolve(result);
    }
    return result.replace(/\/$/, '');
  }

  public async index(): Promise<void> {
    const root = this.getRoot();
    logger.info(`Indexing datastore path: ${root}`);

    // Read artefact manifests
    const manifests = await this.scanner.scan(root);
    const datastorePath = this.getRoot();

    function hash(path: string): string {
      const hasher = crypto.createHash('sha512');
      return hasher.update(path).digest('hex');
    }

    function relativePath(manifestPath: string, filePath: string): string {
      const absolute = path.resolve(path.dirname(manifestPath), filePath);
      return path.relative(datastorePath, absolute);
    }

    const artefacts: ArtefactDocument[] = [];
    for (const manifest of manifests) {
      try {
        const artefact = manifest.artefact;
        const artefactPath = path.relative(datastorePath, manifest.path);
        const files = manifest.artefact.files?.map((file) => relativePath(manifest.path, file));
        const previews = manifest.artefact.previews?.map((preview) => relativePath(manifest.path, preview));
        const license = relativePath(manifest.path, manifest.artefact.license);

        const doc: ArtefactDocument = {
          _id: hash(artefactPath),
          name: artefact.name.map(MongoI18nMapper.textToMongo),
          type: artefact.type,
          description: (artefact.description || []).map(MongoI18nMapper.textToMongo),
          keywords: (artefact.keywords || []).map(MongoI18nMapper.listToMongo),
          files,
          previews,
          provider: artefact.provider,
          link: artefact.link,
          license,
          attributions: artefact.attributions,
          path: artefactPath,
          weight: artefact.weight,
        };

        artefacts.push(doc);
      } catch (err) {
        logger.error(`Error while processing manifest: ${manifest.path}`, err);
      }
    }

    // Save them
    await this.dao.saveAll(artefacts);

    // Delete non existing ones
    const existing = await this.dao.findAll();
    const toDelete = existing.filter((artA) => !artefacts.find((artB) => artB._id === artA._id));
    await this.dao.delete(toDelete);

    logger.info('Indexing done !');
  }
}
