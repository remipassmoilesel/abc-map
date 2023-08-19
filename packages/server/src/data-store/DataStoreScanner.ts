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

import { ArtefactManifestWithPath } from './ArtefactManifestSchema';
import { ManifestReader } from './ManifestReader';
import * as util from 'util';
import { Logger } from '@abc-map/shared';
import { glob } from 'glob';
const globPromise = util.promisify(glob);

export const logger = Logger.get('DataStoreScanner');

export declare type GlobFunction = typeof globPromise;

/**
 * This class looks for artefact manifest in specified root, read them then return them.
 */
export class DataStoreScanner {
  public static create(): DataStoreScanner {
    return new DataStoreScanner(ManifestReader.create(), globPromise);
  }

  constructor(private reader: ManifestReader, private glob: GlobFunction) {}

  public async scan(root: string): Promise<ArtefactManifestWithPath[]> {
    const paths = await this.glob(`{${root}/**/artefact.yml,${root}/**/artefact.yaml}`, { nocase: true });

    const manifests = Promise.all(paths.map((path) => this.reader.read(path).catch((err) => logger.error(`Invalid manifest: ${path}`, err))));
    return manifests.then((res) => res.filter((m): m is ArtefactManifestWithPath => !!m));
  }
}
