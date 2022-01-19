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

import { AbcProjectMetadata } from '@abc-map/shared';
import { ProjectDocument } from './ProjectDocument';

export class ProjectMapper {
  public static dtoToDoc(dto: AbcProjectMetadata, userId: string): ProjectDocument {
    return {
      _id: dto.id,
      ownerId: userId,
      name: dto.name,
      version: dto.version,
      containsCredentials: dto.containsCredentials,
      public: dto.public,
    };
  }

  public static docToDto(doc: ProjectDocument): AbcProjectMetadata {
    return {
      id: doc._id,
      name: doc.name,
      version: doc.version,
      containsCredentials: doc.containsCredentials,
      public: doc.public,
    };
  }
}
