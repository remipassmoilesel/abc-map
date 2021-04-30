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

import { assert } from 'chai';
import { AbcLayout, LayoutFormats } from './AbcLayout';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcLayout', () => {
  it('layout should not change without migration', () => {
    /* eslint-disable */
    const layoutWitness = '{"id":"test-layout-id","name":"Test layout","format":{"name":"Test layout format","width":800,"height":600,"orientation":"portrait"},"view":{"center":[1,2],"resolution":3,"projection":{"name":"EPSG:4326"}}}';
    /* eslint-enable */

    const currentLayout: AbcLayout = {
      id: 'test-layout-id',
      name: 'Test layout',
      format: {
        name: 'Test layout format',
        width: 800,
        height: 600,
        orientation: 'portrait',
      },
      view: {
        center: [1, 2],
        resolution: 3,
        projection: {
          name: 'EPSG:4326',
        },
      },
    };

    assert.equal(JSON.stringify(currentLayout), layoutWitness);
  });

  it('layout formats should not change without migration', () => {
    /* eslint-disable */
    const formatsWitness = '[{"name":"A5 Portrait","width":148,"height":210,"orientation":"portrait"},{"name":"A5 Paysage","width":210,"height":148,"orientation":"landscape"},{"name":"A4 Portrait","width":210,"height":297,"orientation":"portrait"},{"name":"A4 Paysage","width":297,"height":210,"orientation":"landscape"},{"name":"A3 Portrait","width":297,"height":420,"orientation":"portrait"},{"name":"A3 Paysage","width":420,"height":297,"orientation":"landscape"}]';
    /* eslint-enable */

    assert.equal(JSON.stringify(LayoutFormats.ALL), formatsWitness);
  });
});
