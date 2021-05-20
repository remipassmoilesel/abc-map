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

import { FrontendRoutes } from '@abc-map/shared';
import { TestHelper } from '../../helpers/TestHelper';
import { LayerControls } from '../../helpers/LayerControls';
import { History } from '../../helpers/History';

describe('Map', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('default map should have two layers with one active', function () {
    cy.visit(FrontendRoutes.map().raw())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('Géométries');
      });
  });

  it('user can add layer', function () {
    cy.visit(FrontendRoutes.map().raw())
      .then(() => LayerControls.addOsmLayer())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries', 'OpenStreetMap']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('OpenStreetMap');
      });
  });

  it('user can add layer then undo and redo', function () {
    cy.visit(FrontendRoutes.map().raw())
      .then(() => LayerControls.addOsmLayer())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries', 'OpenStreetMap']);
      })
      // Undo
      .then(() => History.undo())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('Géométries');
      })
      // Redo
      .then(() => History.redo())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries', 'OpenStreetMap']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('OpenStreetMap');
      });
  });

  it('user can rename layer', function () {
    cy.visit(FrontendRoutes.map().raw())
      .get('[data-cy=rename-layer]')
      .click()
      .get('[data-cy=modal-rename-input]')
      .clear()
      .type('Awesome layer')
      .get('[data-cy=rename-modal-confirm]')
      .click()
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Awesome layer']);
      });
  });

  it('user can delete layer', function () {
    cy.visit(FrontendRoutes.map().raw())
      .get('[data-cy=delete-layer]')
      .click()
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap']);
      });
  });
});
