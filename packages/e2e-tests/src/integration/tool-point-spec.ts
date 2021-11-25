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
      .then(() => ToolSelector.enable(MapTool.Point))
      // Move map
      .then(() => Draw.drag(200, 200, 400, 200, { ctrlKey: true }))
      .then(() => MainMap.getReference())
      .should((map) => {
        const view = map.getViewExtent();
        expect(view).deep.equal([-4924817.756870515, -4121477.6853103423, 9535845.002232268, 5897276.48608428]);
      });
  });

  it('user can draw', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getType()).equal('Point');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950186, 4048111.897809295, -1118865.2444950186, 4048111.897809295]);
        expect(features[0].get(StyleProperties.PointSize)).equal(DefaultDrawingStyle.point.size);
        expect(features[0].get(StyleProperties.PointColor)).equal(DefaultDrawingStyle.point.color);
        expect(features[0].get(StyleProperties.PointIcon)).equal(DefaultDrawingStyle.point.icon);

        expect(features[1].getGeometry()?.getType()).equal('Point');
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-629668.2634698907, 3558914.916784167, -629668.2634698907, 3558914.916784167]);
        expect(features[0].get(StyleProperties.PointSize)).equal(DefaultDrawingStyle.point.size);
        expect(features[0].get(StyleProperties.PointColor)).equal(DefaultDrawingStyle.point.color);
        expect(features[0].get(StyleProperties.PointIcon)).equal(DefaultDrawingStyle.point.icon);
      });
  });

  it('user can move points', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.Point))
      // Create point
      .then(() => Draw.click(100, 100))
      // Select it
      .then(() => Draw.click(100, 105, { shiftKey: true }))
      // Modify it
      .then(() => Draw.drag(100, 105, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(1);
        expect(features[0].getGeometry()?.getType()).equal('Point');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([3773104.565756262, -843857.9124419857, 3773104.565756262, -843857.9124419857]);
      });
  });
});
