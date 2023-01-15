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
import Ajv from 'ajv';
import { ValidateFunction } from 'ajv';
import { ProjectMetadataSchema } from '../projects/ProjectMetadata.schema';
import { ConfigInputSchema } from '../config/ConfigInputSchema';
import { ArtefactManifestSchema } from '../data-store/ArtefactManifest';
import { AbcProjectMetadata } from '@abc-map/shared';

const ajv = new Ajv();

/**
 * This class regroup common schemas and helpers.
 *
 * AJV version is constrained by Fastify supported version
 *
 * WARNING: All validate functions keep states from last call (errors, etc ...)
 */
export class Validation {
  public static readonly Ajv = Ajv;

  public static readonly ConfigInput = ajv.compile(ConfigInputSchema);

  public static readonly ProjectMetadata = ajv.compile<AbcProjectMetadata>(ProjectMetadataSchema);

  public static readonly ArtefactManifest = ajv.compile(ArtefactManifestSchema);

  public static formatErrors(validateFunc: ValidateFunction): string {
    return validateFunc.errors?.map((e) => JSON.stringify(e)).join(', ') || 'No validation error message';
  }
}
