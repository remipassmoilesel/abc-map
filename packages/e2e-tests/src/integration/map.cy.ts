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
import { LayerControls } from '../helpers/LayerControls';
import { Routes } from '../helpers/Routes';

describe('Map', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('default map should have two layers with one active', function () {
    cy.visit(Routes.map().format())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Geometries']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('Geometries');
      });
  });

  it('user can add layer', function () {
    cy.visit(Routes.map().format())
      .then(() => LayerControls.addOsmLayer())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Geometries', 'OpenStreetMap']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('OpenStreetMap');
      });
  });

  it('user can add layer then undo and redo', function () {
    cy.visit(Routes.map().format())
      .then(() => LayerControls.addOsmLayer())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Geometries', 'OpenStreetMap']);
      })
      // Undo
      .get('[data-cy=undo]')
      .click()
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Geometries']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('Geometries');
      })
      // Redo
      .get('[data-cy=redo]')
      .click()
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Geometries', 'OpenStreetMap']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('OpenStreetMap');
      });
  });

  it('user can rename layer', function () {
    cy.visit(Routes.map().format())
      // First we wait for active layer
      .wait(300)
      .then(() => LayerControls.getActiveItem())
      // Then we edit it
      .get('[data-cy=edit-layer]')
      .click()
      .get('[data-cy=name-input]')
      .clear()
      .type('My awesome layer')
      .get('[data-cy=submit-button]')
      .click()
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'My awesome layer']);
      });
  });

  it('user can delete layer', function () {
    cy.visit(Routes.map().format())
      // First we wait for active layer
      .wait(300)
      .then(() => LayerControls.getActiveItem())
      // Then we delete it
      .get('[data-cy=delete-layer]')
      .click()
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap']);
      });
  });
});
