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
import { I18nList, I18nText } from '../lang';
import { ArtefactType } from './ArtefactType';

/**
 * This interface represents an artefact as it is generally used in application.
 */
export interface AbcArtefact {
  id: string;
  name: I18nText[];
  type: ArtefactType;
  description: I18nText[];
  /**
   * Keywords used for search and filter
   */
  keywords: I18nList[];
  /**
   * Path to the license file
   */
  license: string;
  /**
   * Attributions text will be added to export and credits
   */
  attributions: string[];
  /**
   * Name of the organism who provide this artefact
   */
  provider: string;
  /**
   * Link to the source of data
   */
  link: string;
  /**
   * Path to the manifest file relative to the datastore
   */
  path: string;
  /**
   * Paths to artefact's files relative to the manifest
   */
  files: string[];

  /**
   * Path to one or more preview images
   */
  previews?: string[];
}
