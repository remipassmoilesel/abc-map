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

import { FrontendRoutes, MapTool } from '@abc-map/shared';
import { TestHelper } from '../../../helpers/TestHelper';
import { ToolSelector } from '../../../helpers/ToolSelector';
import { Draw } from '../../../helpers/Draw';
import { MainMap } from '../../../helpers/MainMap';
import { DataStore } from '../../../helpers/DataStore';
import { TopBar } from '../../../helpers/TopBar';
import { History } from '../../../helpers/History';

describe('Edit properties', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can edit properties, then undo', function () {
    cy.visit(FrontendRoutes.dataStore().raw())
      .then(() => DataStore.importByName('Pays du monde'))
      .then(() => TopBar.map())
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.EditProperties))
      // Edit Algeria
      .then(() => Draw.click(200, 200, { ctrlKey: true }))
      .get('[data-cy=property-name]')
      .should('have.text', 'COUNTRY')
      .get('[data-cy=property-value]')
      .should('have.value', 'Algeria')
      // Add property 1
      .get('[data-cy=new-name-unknown]')
      .clear()
      .type('population')
      .get('[data-cy=new-value-population]')
      .clear()
      .type('123456')
      .get('[data-cy=new-property-button]')
      .click()
      // Add property 2
      .get('[data-cy=new-name-unknown]')
      .clear()
      .type('pib')
      .get('[data-cy=new-value-pib]')
      .clear()
      .type('180')
      .get('[data-cy=new-property-button]')
      .click()
      .get('[data-cy=properties-modal-confirm]')
      .click()
      // Check property names
      .then(() => Draw.click(200, 200, { ctrlKey: true }))
      .get('[data-cy=property-name]')
      .should((elem) => {
        const names = elem.toArray().map((e) => e.textContent);
        expect(names).deep.equal(['COUNTRY', 'population', 'pib']);
      })
      // Check property values
      .get('[data-cy=property-value]')
      .should((elem) => {
        const values = elem.toArray().map((e) => (e as HTMLInputElement).value);
        expect(values).deep.equal(['Algeria', '123456', '180']);
      })
      .get('[data-cy=properties-modal-cancel]')
      .click()
      // Undo
      .then(() => History.undo())
      .then(() => Draw.click(200, 200, { ctrlKey: true }))
      .get('[data-cy=property-name]')
      .should((elem) => {
        const names = elem.toArray().map((e) => e.textContent);
        expect(names).deep.equal(['COUNTRY']);
      })
      // Check property values
      .get('[data-cy=property-value]')
      .should((elem) => {
        const values = elem.toArray().map((e) => (e as HTMLInputElement).value);
        expect(values).deep.equal(['Algeria']);
      });
  });
});
