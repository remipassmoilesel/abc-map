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
import { Validation } from '../utils/Validation';
import { assert } from 'chai';
import { TestHelper } from '../utils/TestHelper';
import { normalizeBlankChars } from '../utils/normalizeBlankChars';
import { ArtefactManifest } from '@abc-map/shared';

describe('ArtefactManifestSchema', () => {
  it('simple manifest', () => {
    const sample = TestHelper.sampleArtefactManifest('artefact-1');

    assert.ok(Validation.ArtefactManifest(sample));
  });

  it('full manifest', () => {
    const template = TestHelper.sampleArtefactManifest('artefact-1');
    const sample: ArtefactManifest = {
      ...template,
      artefact: {
        ...template.artefact,
        metadata: {
          foo: 'bar',
          bar: {
            variable: 'value',
          },
        },
        weight: 100,
        previews: ['preview-1.png', 'preview-2.png'],
      },
    };

    assert.ok(Validation.ArtefactManifest(sample));
  });

  it('invalid manifest', () => {
    const sample = TestHelper.sampleArtefactManifest('artefact-1') as any;
    sample.badProperty = 'badValue';

    assert.notOk(Validation.ArtefactManifest(sample));
    assert.equal(
      normalizeBlankChars(Validation.formatErrors(Validation.ArtefactManifest)),
      normalizeBlankChars(`
            {
              "instancePath": "",
              "schemaPath": "#/additionalProperties",
              "keyword": "additionalProperties",
              "params": {
                "additionalProperty": "badProperty"
              },
              "message": "must NOT have additional properties"
            }
`)
    );
  });
});
