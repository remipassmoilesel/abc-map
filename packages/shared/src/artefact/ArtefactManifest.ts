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

import { I18nList, I18nText } from '../lang';
import { ArtefactType } from './ArtefactType';

/**
 * This interface represents an artefact yaml manifest file.
 *
 * An artefact is a bundle of data or a pre-configured data source, usable in Abc-Map.
 *
 */
export interface ArtefactManifest {
  /**
   * Format version, 0.0.1 for the moment
   */
  version: string;
  artefact: {
    /**
     * Name of artefact, displayed in lists
     */
    name: I18nText[];
    /**
     * Type: vector or basemap
     */
    type: ArtefactType;
    /**
     * Full description. Can be HTML. You do not need to create HTML links, they will be created automatically.
     */
    description?: I18nText[];
    /**
     * Keywords attached to artefact. They will be used in search.
     */
    keywords?: I18nList[];
    /**
     * Full text license or list of links.
     */
    license: string;
    /**
     * Name of the entity which provide or produce data.
     */
    provider: string;
    /**
     * Link to the source of the data.
     */
    link: string;
    /**
     * Attributions that will be displayed on maps
     */
    attributions: string[];
    /**
     * List of paths to artefact files. Relative to this manifest.
     */
    files: string[];
    /**
     * List of paths to preview images. Relative to this manifest.
     *
     * Can be all format supported by <img/> tag.
     */
    previews?: string[];
    /**
     * Weight is used to sort results in search and lists. The higher the number, the more likely the artifact is above.
     */
    weight?: number;
  };
}
