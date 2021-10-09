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

import { AbcArtefact } from '@abc-map/shared';
import { ArtefactDocument } from './ArtefactDocument';
import { MongoI18nMapper } from '../mongodb/MongodbI18n';

export class ArtefactMapper {
  public static dtoToDoc(dto: AbcArtefact): ArtefactDocument {
    return {
      _id: dto.id,
      name: dto.name.map(MongoI18nMapper.textToMongo),
      path: dto.path,
      files: dto.files,
      description: dto.description.map(MongoI18nMapper.textToMongo),
      keywords: dto.keywords.map(MongoI18nMapper.listToMongo),
      license: dto.license,
      link: dto.link || null,
    };
  }

  public static docToDto(doc: ArtefactDocument): AbcArtefact {
    return {
      id: doc._id,
      name: doc.name.map(MongoI18nMapper.textFromMongo),
      path: doc.path,
      files: doc.files,
      description: doc.description.map(MongoI18nMapper.textFromMongo),
      keywords: doc.keywords.map(MongoI18nMapper.listFromMongo),
      license: doc.license,
      link: doc.link || undefined,
    };
  }
}
