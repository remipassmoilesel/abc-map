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

import { StyleProperties } from '@abc-map/shared';
import { MapTool } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { ToolSelector } from '../helpers/ToolSelector';
import { Draw } from '../helpers/Draw';
import { MainMap } from '../helpers/MainMap';
import { DefaultDrawingStyle } from '../helpers/DefaultDrawingStyle';
import { Routes } from '../helpers/Routes';

describe('Tool Point', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can move map with CTRL', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .get('[data-cy=draw-menu]')
      .click()
      .then(() => ToolSelector.enable(MapTool.Point))
      // Move map
      .then(() => Draw.drag(200, 200, 400, 200, { ctrlKey: true }))
      .then(() => MainMap.getReference())
      .should((map) => {
        const view = map.getViewExtent();
        expect(view).deep.equal([-7370802.661996155, -4121477.6853103423, 11981829.907357909, 5897276.48608428]);
      });
  });

  it('user can draw', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .get('[data-cy=draw-menu]')
      .click()
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(300, 300))
      .then(() => Draw.click(350, 350))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getType()).equal('Point');
        expect(features[0].get(StyleProperties.PointSize)).equal(DefaultDrawingStyle.point.size);
        expect(features[0].get(StyleProperties.PointColor)).equal(DefaultDrawingStyle.point.color);
        expect(features[0].get(StyleProperties.PointIcon)).equal(DefaultDrawingStyle.point.icon);

        expect(features[1].getGeometry()?.getType()).equal('Point');
        expect(features[1].get(StyleProperties.PointSize)).equal(DefaultDrawingStyle.point.size);
        expect(features[1].get(StyleProperties.PointColor)).equal(DefaultDrawingStyle.point.color);
        expect(features[1].get(StyleProperties.PointIcon)).equal(DefaultDrawingStyle.point.icon);

        expect(features.map((f) => f.getGeometry()?.getExtent())).deep.equals([
          [-1608062.2255201465, 2091323.9737087828, -1608062.2255201465, 2091323.9737087828],
          [-1118865.2444950184, 1602126.9926836547, -1118865.2444950184, 1602126.9926836547],
        ]);
      });
  });

  it('user can move points', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .get('[data-cy=draw-menu]')
      .click()
      .then(() => ToolSelector.enable(MapTool.Point))
      // Create point
      .then(() => Draw.click(300, 300))
      // Select it
      .then(() => Draw.click(300, 295, { shiftKey: true }))
      // Modify it
      .then(() => Draw.drag(300, 295, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(1);
        expect(features[0].getGeometry()?.getType()).equal('Point');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([1327119.660630622, -843857.9124419857, 1327119.660630622, -843857.9124419857]);
      });
  });
});
