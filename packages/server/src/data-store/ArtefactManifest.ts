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
import { ArtefactManifest } from '@abc-map/shared';

export interface ArtefactManifestRead extends ArtefactManifest {
  path: string;
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
  required: ['version', 'artefact'],
  additionalProperties: false,
  properties: {
    version: { type: 'string' },
    path: { type: 'string' },
    artefact: {
      type: 'object',
      required: ['name', 'license', 'attributions', 'link', 'provider'],
      additionalProperties: false,
      properties: {
        name: I18nTextArray,
        type: { type: 'string' },
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
        attributions: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        provider: { type: 'string' },
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
        previews: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        weight: { type: 'number' },
      },
    },
  },
};
