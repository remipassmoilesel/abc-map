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

import { ArtefactManifest } from './ArtefactManifest';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { promises as fs } from 'fs';

export class ManifestReader {
  public static async read(manifestPath: string): Promise<ArtefactManifest> {
    const errorPrefix = ` Manifest error on ${manifestPath}:`;
    const file = await fs.readFile(manifestPath, 'utf8');
    const manifest: ArtefactManifest | undefined = yaml.load(file) as ArtefactManifest | undefined;
    if (!manifest) {
      return Promise.reject(new Error(`Invalid manifest: ${manifestPath}`));
    }

    manifest.path = manifestPath;

    if (!manifest.artefact) {
      return Promise.reject(new Error(`${errorPrefix} Manifest must contain an artefact section`));
    }
    if (!manifest.artefact.name) {
      return Promise.reject(new Error(`${errorPrefix} Name field is mandatory`));
    }
    if (!manifest.artefact.license) {
      return Promise.reject(new Error(`${errorPrefix} Licence field is mandatory`));
    }
    if (!manifest.artefact.files.length) {
      return Promise.reject(new Error(`${errorPrefix} Artefact must contains files`));
    }

    const fileChecks: Promise<any>[] = manifest.artefact.files.flatMap((filePath) =>
      fs
        .stat(path.resolve(path.dirname(manifestPath), filePath))
        .then((stat) => {
          if (!stat.isFile()) {
            return Promise.reject(new Error(`${errorPrefix} File ${file} must be a regular file`));
          }
        })
        .catch((err) => {
          return Promise.reject(new Error(`${errorPrefix} File ${file} must be a regular file: ${err.message}`));
        })
    );

    return Promise.all(fileChecks).then(() => manifest);
  }
}
