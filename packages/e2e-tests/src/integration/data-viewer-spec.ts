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
import { FrontendRoutes } from '@abc-map/shared';
import { DataStore } from '../helpers/DataStore';
import { TopBar } from '../helpers/TopBar';
import { Download } from '../helpers/Download';

describe('Data viewer module', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can see layer data', () => {
    cy.visit(FrontendRoutes.dataProcessing().withoutOptionals())
      .then(() => DataStore.importByName('Pays du monde'))
      .then(() => TopBar.dataProcessing())
      .get('[data-cy=data-viewer]')
      .click()
      .get('[data-cy=layer-selector] > option')
      .eq(2)
      .then((opt) => cy.get('[data-cy=layer-selector]').select(opt.text()))
      .get('[data-cy=data-table] [data-cy=header]')
      .should((elems) => {
        expect(elems.toArray().map((e) => e.textContent)).deep.equal(['COUNTRY']);
      })
      .get('[data-cy=data-table] [data-cy=cell]')
      .should((elems) => {
        expect(elems).length(252);

        const cells = elems
          .toArray()
          .slice(0, 5)
          .map((e) => e.textContent);
        expect(cells).deep.equal(['South Korea', 'Turkmenistan', 'Tajikistan', 'North Korea', 'Uzbekistan']);
      });
  });

  it('User can download', () => {
    cy.visit(FrontendRoutes.dataProcessing().withoutOptionals())
      .then(() => DataStore.importByName('Pays du monde'))
      .then(() => TopBar.dataProcessing())
      .get('[data-cy=data-viewer]')
      .click()
      .get('[data-cy=layer-selector] > option')
      .eq(2)
      .then((opt) => cy.get('[data-cy=layer-selector]').select(opt.text()))
      .get('[data-cy=download]')
      .click()
      .then(() => Download.fileAsBlob())
      .should(async (file) => {
        expect(file).not.undefined;
        expect(file.size).equal(3_422);
      });
  });
});
