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
import Ajv, { ValidateFunction } from 'ajv';
import { ProjectMetadataSchema } from '../projects/ProjectMetadata.schema';
import { ConfigInputSchema } from '../config/ConfigInputSchema';
import { ArtefactManifestWithPath, ArtefactManifestSchema } from '../data-store/ArtefactManifestSchema';
import { AbcProjectMetadata } from '@abc-map/shared';
import { ConfigInput } from '../config/Config';

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

  public static readonly ConfigInput = ajv.compile<ConfigInput>(ConfigInputSchema);

  public static readonly ProjectMetadata = ajv.compile<AbcProjectMetadata>(ProjectMetadataSchema);

  public static readonly ArtefactManifest = ajv.compile<ArtefactManifestWithPath>(ArtefactManifestSchema);

  public static formatErrors(validateFunc: ValidateFunction): string {
    const errors = (validateFunc.errors || []).map((err) => JSON.stringify(err, null, 2));
    if (!errors.length) {
      errors.push('<No error message found>');
    }

    return errors.join(', ');
  }
}
