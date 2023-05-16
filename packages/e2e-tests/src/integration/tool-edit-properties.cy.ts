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

import { MapTool } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { ModeName, ToolSelector } from '../helpers/ToolSelector';
import { MainMap } from '../helpers/MainMap';
import { DataStore } from '../helpers/DataStore';
import { TopBar } from '../helpers/TopBar';
import { Routes } from '../helpers/Routes';
import { Draw } from '../helpers/Draw';
import { ProjectMenu } from '../helpers/ProjectMenu';
import { Modules } from '../helpers/Modules';

describe('Edit properties', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can move map', function () {
    cy.visit(Routes.map().format())
      .then(() => ProjectMenu.newProject())
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.EditProperties))
      .then(() => ToolSelector.toolMode(ModeName.MoveMap))
      // Move map
      .then(() => Draw.drag(200, 200, 400, 200))
      .then(() => MainMap.getReference())
      .should((map) => {
        const view = map.getViewExtent();

        expect(view).deep.equal([-7380586.601616657, -4155721.4739821013, 11991613.846978411, 5931520.274756039], `Actual: "${JSON.stringify(view)}"`);
      });
  });

  it('user can edit properties, then undo', function () {
    cy.visit(Routes.map().format())
      .then(() => ProjectMenu.newProject())
      .then(() => Modules.open('data-store'))
      .then(() => DataStore.importByName('Countries of the world'))
      .then(() => TopBar.map())
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.EditProperties))
      // Edit Algeria
      .then(() => Draw.click(500, 200))
      .get('[data-cy=property-name]')
      .eq(0)
      .should('have.value', 'COUNTRY')
      .get('[data-cy=property-value]')
      .eq(0)
      .should('have.value', 'Algeria')
      // Add property 1
      .get('[data-cy=new-property-button]')
      .click()
      .get('[data-cy=property-name]')
      .eq(1)
      .clear()
      .type('population')
      .get('[data-cy=property-value]')
      .eq(1)
      .clear()
      .type('123456')
      // Add property 2
      .get('[data-cy=new-property-button]')
      .click()
      .get('[data-cy=property-name]')
      .eq(2)
      .clear()
      .type('pib')
      .get('[data-cy=property-value]')
      .eq(2)
      .clear()
      .type('180')
      .get('[data-cy=new-property-button]')
      .click()
      // Confirm
      .get('[data-cy=properties-modal-confirm]')
      .click()
      // Check property names
      .then(() => Draw.click(500, 200))
      .then(() => Draw.click(500, 200))
      .get('[data-cy=property-name]')
      .should((elem) => {
        const names = elem.toArray().map((e) => (e as HTMLInputElement).value);
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
      .get('[data-cy=undo]')
      .click()
      .then(() => Draw.click(500, 200))
      .then(() => Draw.click(500, 200))
      .get('[data-cy=property-name]')
      .should((elem) => {
        const names = elem.toArray().map((e) => (e as HTMLInputElement).value);
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
