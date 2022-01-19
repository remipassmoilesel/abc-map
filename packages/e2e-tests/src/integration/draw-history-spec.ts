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

import { ModeName, ToolSelector } from '../helpers/ToolSelector';
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
          [-3564850.149620659, 3540875.778108865, -3075653.168595531, 4030072.759133993],
          [-2586456.1875704033, 2562481.816058609, -2097259.206545275, 3051678.7970837373],
        ]);
      })
      // First undo
      .get('[data-cy=undo]')
      .click()
      .wait(100)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.149620659, 3540875.778108865, -3075653.168595531, 4030072.759133993],
        ]);
      })
      // Second undo
      .get('[data-cy=undo]')
      .click()
      .wait(100)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(0);
      })
      // First redo
      .get('[data-cy=redo]')
      .click()
      .wait(100)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.149620659, 3540875.778108865, -3075653.168595531, 4030072.759133993],
        ]);
      })
      // Second redo
      .get('[data-cy=redo]')
      .click()
      .wait(100)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(2);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.149620659, 3540875.778108865, -3075653.168595531, 4030072.759133993],
          [-2586456.1875704033, 2562481.816058609, -2097259.206545275, 3051678.7970837373],
        ]);
      });
  });

  it('user can modify feature then undo', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.LineString))
      // Create line
      .then(() => Draw.click(100, 100))
      .then(() => Draw.dblclick(150, 150))
      // Select it
      .then(() => ToolSelector.toolMode(ModeName.Modify))
      .then(() => Draw.click(150, 150))
      // First modification
      .then(() => Draw.drag(150, 150, 200, 200))
      // Second modification
      .then(() => Draw.drag(100, 100, 400, 400))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-2586456.1875704033, 1094890.8729832247, -629668.2634698907, 3051678.7970837373],
        ]);
      })
      // First undo
      .get('[data-cy=undo]')
      .click()
      .wait(100)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.149620659, 3051678.7970837373, -2586456.1875704033, 4030072.759133993],
        ]);
      })
      // Second undo
      .get('[data-cy=undo]')
      .click()
      .wait(100)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.149620659, 3540875.778108865, -3075653.168595531, 4030072.759133993],
        ]);
      })
      // First redo
      .get('[data-cy=redo]')
      .click()
      .wait(100)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-3564850.149620659, 3051678.7970837373, -2586456.1875704033, 4030072.759133993],
        ]);
      })
      // Second redo
      .get('[data-cy=redo]')
      .click()
      .wait(100)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features.map((feat) => feat.getGeometry()?.getExtent())).deep.equals([
          [-2586456.1875704033, 1094890.8729832247, -629668.2634698907, 3051678.7970837373],
        ]);
      });
  });
});
