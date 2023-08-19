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
import * as yaml from 'js-yaml';
import * as path from 'path';
import { promises as fs } from 'fs';
import { isLangSupported } from '@abc-map/shared';
import { Validation } from '../utils/Validation';

export declare type FileModule = typeof fs;

export class ManifestReader {
  public static create(): ManifestReader {
    return new ManifestReader(fs);
  }

  constructor(private file: FileModule) {}

  public async read(manifestPath: string): Promise<ArtefactManifestWithPath> {
    const fileContent = await this.file.readFile(manifestPath, 'utf8');
    const manifest = yaml.load(fileContent) as ArtefactManifestWithPath | undefined;
    if (!manifest) {
      return Promise.reject(new Error(`Invalid manifest: ${manifestPath}`));
    }

    if (!Validation.ArtefactManifest(manifest)) {
      return Promise.reject(new Error(`Invalid manifest: ${Validation.formatErrors(Validation.ArtefactManifest)}`));
    }

    manifest.path = manifestPath;

    // Check languages
    const invalidDescriptionLang = manifest.artefact.description?.map((text) => text.language).find((lang) => !isLangSupported(lang));
    if (invalidDescriptionLang) {
      return Promise.reject(new Error(`Invalid description lang: ${invalidDescriptionLang}`));
    }

    const invalidKeywordLang = manifest.artefact.keywords?.map((text) => text.language).find((lang) => !isLangSupported(lang));
    if (invalidKeywordLang) {
      return Promise.reject(new Error(`Invalid keyword lang: ${invalidKeywordLang}`));
    }

    // Check if all files exists
    const files = [...manifest.artefact.files, manifest.artefact.license, ...(manifest.artefact.previews || [])];

    await Promise.all(
      files
        .filter((path) => !!path)
        .map((filePath) => path.resolve(path.dirname(manifestPath), filePath))
        .map((filePath) => {
          const reject = () => Promise.reject(new Error(`File ${filePath} must be a regular file`));
          return this.file
            .stat(filePath)
            .then((stat) => (!stat.isFile() ? reject() : undefined))
            .catch(() => reject());
        })
    );

    return manifest;
  }
}
