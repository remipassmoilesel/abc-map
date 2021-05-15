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
import * as Ajv from 'ajv';
import { ProjectMetadataSchema } from '../projects/ProjectMetadata.schema';
import { ConfigInputSchema } from '../config/ConfigInputSchema';

const ajv = new Ajv();

/**
 * AJV version is constrained by Fastify supported version
 *
 * WARNING: All validate functions keep states from last call (errors, etc ...)
 */
export class Validation {
  public static readonly ajv = ajv;

  public static readonly configInput = ajv.compile(ConfigInputSchema);

  public static readonly projectMetadata = ajv.compile(ProjectMetadataSchema);

  public static formatErrors(validateFunc: Ajv.ValidateFunction): string {
    return validateFunc.errors?.map((e) => JSON.stringify(e)).join(', ') || 'No validation error message';
  }
}
