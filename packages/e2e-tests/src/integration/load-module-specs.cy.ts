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

import { TestHelper } from '../helpers/TestHelper';
import { DataStore } from '../helpers/DataStore';
import { TopBar } from '../helpers/TopBar';
import { MainMap } from '../helpers/MainMap';

describe('Load module', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can load module then use it', () => {
    // Import layer
    DataStore.importByName('Cities of the world')
      .then(() => TopBar.moduleIndex())
      // Open remote module loader
      .get('[data-cy=add-module-modal]')
      .click()
      // Type module URL then load it
      .get('[data-cy=module-urls]')
      .clear()
      .type('https://abc-map.gitlab.io/module-template/')
      .get('[data-cy=load-modules]')
      .click()
      // Open module, process layer
      .get('[data-cy^=open_example-module]')
      .eq(0)
      .click()
      .get('h2')
      .should('have.text', 'Buffers (Module template)')
      .get('select[name="layerId"]')
      .select(3)
      .get('button[type="submit"]')
      .click()
      // Wait for completion
      .get('[data-cy=module-viewport]')
      .contains('Processing done', { timeout: 16_000 })
      .then(() => TopBar.map())
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(4);
        expect(layers[3].name).equal('Geometries');

        const features = map.getActiveLayerFeatures();
        expect(features.length).equal(610);

        const buffers = features
          .sort((a, b) => (a.get('NAME') as string).localeCompare(b.get('NAME') as string))
          .slice(0, 10)
          .map((f) => ({ country: f.get('NAME'), geometry: f.getGeometry()?.getExtent() }));

        expect(buffers).deep.equal([
          {
            country: 'Abidjan',
            geometry: [-447714.3934496843, 593615.5369063531, -447714.3934496843, 593615.5369063531],
          },
          {
            country: 'Abu Dhabi',
            geometry: [6080189.360046546, 2782193.158447658, 6080189.360046546, 2782193.158447658],
          },
          {
            country: 'Abuja',
            geometry: [829706.1500958072, 1031585.0898630614, 829706.1500958072, 1031585.0898630614],
          },
          {
            country: 'Acapulco',
            geometry: [-11124323.21180544, 1917843.6490135374, -11124323.21180544, 1917843.6490135374],
          },
          {
            country: 'Accra',
            geometry: [-22366.716909710143, 619749.3147362078, -22366.716909710143, 619749.3147362078],
          },
          {
            country: 'Adana',
            geometry: [3932290.1806261786, 4439104.1286528995, 3932290.1806261786, 4439104.1286528995],
          },
          {
            country: 'Adelaide',
            geometry: [15459013.579937985, -4152816.1700075916, 15459013.579937985, -4152816.1700075916],
          },
          { country: 'Aden', geometry: [5029414.628012112, 1443874.4707636002, 5029414.628012112, 1443874.4707636002] },
          {
            country: 'Adis Abeba',
            geometry: [4308064.378629719, 1009402.3860881428, 4308064.378629719, 1009402.3860881428],
          },
          {
            country: 'Agadez',
            geometry: [888329.5386535738, 1916169.1953382867, 888329.5386535738, 1916169.1953382867],
          },
        ]);
      });
  });
});
