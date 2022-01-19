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

import { FeatureProperties, MapTool, StyleProperties } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { ToolSelector } from '../helpers/ToolSelector';
import { Draw } from '../helpers/Draw';
import { MainMap } from '../helpers/MainMap';
import { DefaultDrawingStyle } from '../helpers/DefaultDrawingStyle';
import { Routes } from '../helpers/Routes';

describe('Tool Selection', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can select', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.Point))
      // Create points
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      // Select them
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(150, 150, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(3);
        expect(features[0].get(FeatureProperties.Selected)).equal(false);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-3564850.149620659, 4030072.759133993, -3564850.149620659, 4030072.759133993]);
        expect(features[1].get(FeatureProperties.Selected)).equal(true);
        expect(features[2].get(FeatureProperties.Selected)).equal(true);
      });
  });

  it('user can duplicate selection then undo', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.Point))
      // Create points
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      // Select them
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(150, 150, 600, 600))
      .get('[data-cy=duplicate-selection]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(5);
        expect(features.map((f) => f.getGeometry()?.getExtent())).deep.equals([
          [-3564850.149620659, 4030072.759133993, -3564850.149620659, 4030072.759133993],
          [-3075653.168595531, 3540875.778108865, -3075653.168595531, 3540875.778108865],
          [-2586456.1875704033, 3051678.7970837373, -2586456.1875704033, 3051678.7970837373],
          [-2782134.9799804543, 3247357.5894937883, -2782134.9799804543, 3247357.5894937883],
          [-2292937.9989553266, 2758160.6084686606, -2292937.9989553266, 2758160.6084686606],
        ]);
      })
      .get('[data-cy=undo]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(3);
      })
      .get('[data-cy=redo]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(5);
      });
  });

  it('user can drag selection then undo', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      // Draw points
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(300, 300))
      .then(() => Draw.click(350, 350))
      // Select them
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(250, 250, 400, 400))
      // Drag them
      .then(() => Draw.drag(300, 300, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features.map((f) => f.getGeometry()?.getExtent())).deep.equals([
          [1327119.660630621, -861897.051117287, 1327119.660630621, -861897.051117287],
          [1816316.6416557487, -1351094.0321424147, 1816316.6416557487, -1351094.0321424147],
        ]);
      })
      // Undo
      .get('[data-cy=undo]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features.map((f) => f.getGeometry()?.getExtent())).deep.equals([
          [-1608062.225520147, 2073284.835033481, -1608062.225520147, 2073284.835033481],
          [-1118865.2444950193, 1584087.8540083533, -1118865.2444950193, 1584087.8540083533],
        ]);
      })
      // Redo
      .get('[data-cy=redo]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features.map((f) => f.getGeometry()?.getExtent())).deep.equals([
          [1327119.660630621, -861897.051117287, 1327119.660630621, -861897.051117287],
          [1816316.6416557487, -1351094.0321424147, 1816316.6416557487, -1351094.0321424147],
        ]);
      });
  });

  it('user can drag duplicated features', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      // Draw points
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      // Select them
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(100, 100, 400, 400))
      // Duplicate them
      .get('[data-cy=duplicate-selection]')
      .click()
      // Drag duplicated
      .then(() => Draw.drag(230, 230, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features.map((f) => f.getGeometry()?.getExtent())).deep.equals([
          [-3075653.168595531, 3540875.778108865, -3075653.168595531, 3540875.778108865],
          [-2586456.1875704033, 3051678.7970837373, -2586456.1875704033, 3051678.7970837373],
          [837922.6796054933, -372700.0700921593, 837922.6796054933, -372700.0700921593],
          [1327119.660630621, -861897.051117287, 1327119.660630621, -861897.051117287],
        ]);
      });
  });

  it('user can change stroke style then undo', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.Polygon))
      // Draw feature
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(100, 150))
      .then(() => Draw.dblclick(150, 100))
      // Select it
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(50, 50, 400, 400))
      .get('[data-cy=stroke-color]')
      .wait(800)
      .click()
      .get('div[title="#D0021B"]')
      .click()
      .get('[data-cy=close-modal]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.StrokeColor]).equal('rgba(208,2,27,1)');
      })
      // Undo
      .get('[data-cy=undo]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.StrokeColor]).equal(DefaultDrawingStyle.stroke.color);
      })
      // Redo
      .get('[data-cy=redo]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.StrokeColor]).equal('rgba(208,2,27,1)');
      });
  });

  it('user can change fill style then undo', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.Polygon))
      // Draw feature then select
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(100, 150))
      .then(() => Draw.dblclick(150, 100))
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(50, 50, 400, 400))
      .get('[data-cy=fill-color1]')
      .click()
      .get('div[title="#D0021B"]')
      .click()
      .get('[data-cy=close-modal]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.FillColor1]).equal('rgba(208,2,27,1)');
      })
      // Undo
      .get('[data-cy=undo]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features[0].get(StyleProperties.FillColor1)).equal(DefaultDrawingStyle.fill.color1);
      })
      // Undo
      .get('[data-cy=redo]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.FillColor1]).equal('rgba(208,2,27,1)');
      });
  });
});
