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

export interface ArtefactManifest {
  version: string;
  path: string;
  artefact: {
    /**
     * Readable name of the artefact
     */
    name: string;
    description?: string;
    keywords?: string[];
    /**
     * Path to the license file
     */
    license: string;
    link?: string;
    /**
     * List of files that will be downloaded
     */
    files: string[];
  };
}
