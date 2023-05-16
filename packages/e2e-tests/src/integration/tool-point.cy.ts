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

import { MapTool, StyleProperties } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { ModeName, ToolSelector } from '../helpers/ToolSelector';
import { Draw } from '../helpers/Draw';
import { MainMap } from '../helpers/MainMap';
import { DefaultDrawingStyle } from '../helpers/DefaultDrawingStyle';
import { Routes } from '../helpers/Routes';
import { ProjectMenu } from '../helpers/ProjectMenu';

describe('Tool Point', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can move map', function () {
    cy.visit(Routes.map().format())
      .then(() => ProjectMenu.newProject())
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => ToolSelector.toolMode(ModeName.MoveMap))
      // Move map
      .then(() => Draw.drag(200, 200, 600, 200))
      .then(() => MainMap.getReference())
      .should((map) => {
        const viewExtent = map.getViewExtent();
        expect(viewExtent).deep.equal(
          [-9337374.525717169, -4155721.4739821013, 10034825.9228779, 5931520.274756039],
          `Actual: "${JSON.stringify(viewExtent)}"`
        );
      });
  });

  it('user can draw', function () {
    cy.visit(Routes.map().format())
      .then(() => ProjectMenu.newProject())
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(300, 300))
      .then(() => Draw.click(350, 350))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        const extents = features.map((f) => f.getGeometry()?.getExtent());

        expect(features[0].getGeometry()?.getType()).equal('Point');
        expect(features[0].get(StyleProperties.PointSize)).equal(DefaultDrawingStyle.point.size);
        expect(features[0].get(StyleProperties.PointColor)).equal(DefaultDrawingStyle.point.color);
        expect(features[0].get(StyleProperties.PointIcon)).equal(DefaultDrawingStyle.point.icon);

        expect(features[1].getGeometry()?.getType()).equal('Point');
        expect(features[1].get(StyleProperties.PointSize)).equal(DefaultDrawingStyle.point.size);
        expect(features[1].get(StyleProperties.PointColor)).equal(DefaultDrawingStyle.point.color);
        expect(features[1].get(StyleProperties.PointIcon)).equal(DefaultDrawingStyle.point.icon);

        expect(extents).deep.equals(
          [
            [-1608062.225520147, 2115783.82276004, -1608062.225520147, 2115783.82276004],
            [-1118865.2444950193, 1626586.8417349122, -1118865.2444950193, 1626586.8417349122],
          ],
          `Actual: "${JSON.stringify(extents)}"`
        );
      });
  });

  it('user can move points', function () {
    cy.visit(Routes.map().format())
      .then(() => ProjectMenu.newProject())
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.Point))
      // Create point
      .then(() => Draw.click(300, 300))
      // Select it
      .then(() => ToolSelector.toolMode(ModeName.Modify))
      .then(() => Draw.click(300, 295))
      // Modify it
      .then(() => Draw.drag(300, 295, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        const extents = features.map((f) => f.getGeometry()?.getExtent());

        expect(features[0].getGeometry()?.getType()).equal('Point');
        expect(extents).deep.equals([[1327119.660630621, -819398.0633907281, 1327119.660630621, -819398.0633907281]], `Actual: "${JSON.stringify(extents)}"`);
      });
  });
});
