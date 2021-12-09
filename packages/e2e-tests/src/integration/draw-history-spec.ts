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

import { ToolSelector } from '../helpers/ToolSelector';
import { MapTool } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { MainMap } from '../helpers/MainMap';
import { Draw } from '../helpers/Draw';
import { Routes } from '../helpers/Routes';

describe('Draw features history', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can add feature then undo and redo', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .get('[data-cy=draw-menu]')
      .click()
      .then(() => ToolSelector.enable(MapTool.LineString))
      // First line
      .then(() => Draw.click(100, 100))
      .then(() => Draw.dblclick(150, 150))
      // Second line
      .then(() => Draw.click(200, 200))
      .then(() => Draw.dblclick(250, 250))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(2);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.1496206587, 3558914.916784167, -3075653.1685955306, 4048111.897809295],
          [-2586456.1875704024, 2580520.954733911, -2097259.2065452747, 3069717.9357590387],
        ]);
      })
      // First undo
      .get('[data-cy=undo]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.1496206587, 3558914.916784167, -3075653.1685955306, 4048111.897809295],
        ]);
      })
      // Second undo
      .get('[data-cy=undo]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(0);
      })
      // First redo
      .get('[data-cy=redo]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.1496206587, 3558914.916784167, -3075653.1685955306, 4048111.897809295],
        ]);
      })
      // Second redo
      .get('[data-cy=redo]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(2);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.1496206587, 3558914.916784167, -3075653.1685955306, 4048111.897809295],
          [-2586456.1875704024, 2580520.954733911, -2097259.2065452747, 3069717.9357590387],
        ]);
      });
  });

  it('user can modify feature then undo', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .get('[data-cy=draw-menu]')
      .click()
      .then(() => ToolSelector.enable(MapTool.LineString))
      // Create line
      .then(() => Draw.click(100, 100))
      .then(() => Draw.dblclick(150, 150))
      // Select it
      .then(() => Draw.click(150, 150, { shiftKey: true }))
      // First modification
      .then(() => Draw.drag(150, 150, 200, 200))
      // Second modification
      .then(() => Draw.drag(100, 100, 400, 400))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-2586456.1875704024, 1112930.011658527, -629668.2634698907, 3069717.9357590387],
        ]);
      })
      // First undo
      .get('[data-cy=undo]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.1496206587, 3069717.9357590387, -2586456.1875704024, 4048111.897809295],
        ]);
      })
      // Second undo
      .get('[data-cy=undo]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.1496206587, 3558914.916784167, -3075653.1685955306, 4048111.897809295],
        ]);
      })
      // First redo
      .get('[data-cy=redo]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.1496206587, 3069717.9357590387, -2586456.1875704024, 4048111.897809295],
        ]);
      })
      // Second redo
      .get('[data-cy=redo]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-2586456.1875704024, 1112930.011658527, -629668.2634698907, 3069717.9357590387],
        ]);
      });
  });
});
