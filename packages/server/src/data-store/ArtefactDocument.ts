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

import { MongodbDocument } from '../mongodb/MongodbDocument';
import { MongoI18nList, MongoI18nText } from '../mongodb/MongodbI18n';
import { ArtefactType } from '@abc-map/shared';

/**
 * There is no need to migrate artefacts, as they are recreated at each startup
 */
export interface ArtefactDocument extends MongodbDocument {
  name: MongoI18nText[];
  type: ArtefactType;
  description: MongoI18nText[];
  keywords: MongoI18nList[];
  license: string;
  attributions: string[];
  provider: string;
  link: string;
  path: string;
  files: string[];
  previews?: string[];
  weight?: number;
}
