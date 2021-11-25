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
import { I18nList, I18nText } from '@abc-map/shared';

export interface ArtefactManifest {
  version: string;
  path: string;
  artefact: {
    /**
     * Readable name of the artefact
     */
    name: I18nText[];
    description?: I18nText[];
    keywords: I18nList[];
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

const I18nTextArray = {
  type: 'array',
  items: {
    type: 'object',
    required: ['language', 'text'],
    properties: {
      language: { type: 'string' },
      text: { type: 'string' },
    },
  },
};

export const ArtefactManifestSchema = {
  type: 'object',
  required: ['artefact'],
  additionalProperties: false,
  properties: {
    version: { type: 'string' },
    path: { type: 'string' },
    artefact: {
      type: 'object',
      required: ['name', 'keywords', 'license', 'files'],
      properties: {
        name: I18nTextArray,
        description: I18nTextArray,
        keywords: {
          type: 'array',
          items: {
            type: 'object',
            required: ['language', 'text'],
            properties: {
              language: { type: 'string' },
              text: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
        license: { type: 'string' },
        link: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        metadata: {
          type: 'object',
        },
      },
    },
  },
};
