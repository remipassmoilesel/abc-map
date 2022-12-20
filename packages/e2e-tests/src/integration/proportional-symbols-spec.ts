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

import { TestHelper } from '../helpers/TestHelper';
import { DataStore } from '../helpers/DataStore';
import { TopBar } from '../helpers/TopBar';
import { TestData } from '../test-data/TestData';
import { MainMap } from '../helpers/MainMap';
import { Modules } from '../helpers/Modules';

describe('Proportional symbols', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can create proportional symbols', () => {
    DataStore.importByName('Countries of the world')
      .then(() => Modules.open('proportional-symbols'))
      // Data source parameters
      .get('[data-cy=data-source-file]')
      .click()
      .get('[data-cy=data-source-import-file]')
      .click()
      .then(() => TestData.countriesCsv())
      .then((file) => cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.csv', fileContent: file }))
      .get('[data-cy=value-field]')
      .select('VALUE')
      .get('[data-cy=data-join-by]')
      .select('COUNTRY')
      // Geometry layer parameters
      .get('[data-cy=geometry-layer] > option')
      .eq(2)
      .then((opt) => cy.get('[data-cy=geometry-layer]').select(opt.text()))
      .get('[data-cy=geometries-join-by]')
      .select('COUNTRY')
      .get('[data-cy=process]')
      .click()
      .get('[data-cy=close-processing-report]')
      .click()
      .then(() => TopBar.map())
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(4);
        expect(layers[3].name).equal('Proportional symbols');

        const features = map.getActiveLayerFeatures();
        expect(features.length).equal(252);

        const properties = features
          .sort((a, b) => (a.get('COUNTRY') as string).localeCompare(b.get('COUNTRY') as string))
          .slice(0, 10)
          .map((f) => ({ country: f.get('COUNTRY'), pointValue: f.get('point-value') }));

        expect(properties).deep.equal([
          { country: 'Afghanistan', pointValue: 11 },
          { country: 'Albania', pointValue: 7 },
          { country: 'Algeria', pointValue: 7 },
          { country: 'American Samoa (US)', pointValue: 19 },
          { country: 'American Virgin Islands (US)', pointValue: 28 },
          { country: 'Andorra', pointValue: 7 },
          { country: 'Angola', pointValue: 6 },
          { country: 'Anguilla (UK)', pointValue: 13 },
          { country: 'Antarctica', pointValue: 10 },
          { country: 'Antigua and Barbuda', pointValue: 19 },
        ]);
      });
  });
});
