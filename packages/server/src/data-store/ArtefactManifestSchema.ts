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
import { ArtefactManifest, I18nList, I18nText } from '@abc-map/shared';
import { JSONSchemaType } from 'ajv';

export interface ArtefactManifestWithPath extends ArtefactManifest {
  path: string;
}

const I18nTextArraySchema: JSONSchemaType<I18nText[]> = {
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

const I18nListSchema: JSONSchemaType<I18nList[]> = {
  type: 'array',
  items: {
    type: 'object',
    required: ['language', 'text'],
    properties: {
      language: { type: 'string' },
      text: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
};

export const ArtefactManifestSchema: JSONSchemaType<ArtefactManifest> = {
  type: 'object',
  required: ['version', 'artefact'],
  additionalProperties: false,
  properties: {
    version: { type: 'string' },
    artefact: {
      type: 'object',
      required: ['name', 'license', 'attributions', 'link', 'provider'],
      additionalProperties: false,
      properties: {
        name: I18nTextArraySchema,
        type: { type: 'string' },
        description: {
          ...I18nTextArraySchema,
          nullable: true,
        },
        keywords: {
          ...I18nListSchema,
          nullable: true,
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
        previews: {
          type: 'array',
          items: {
            type: 'string',
          },
          nullable: true,
        },
        weight: { type: 'number', nullable: true },
        metadata: {
          type: 'object',
          nullable: true,
        },
      },
    },
  },
};
