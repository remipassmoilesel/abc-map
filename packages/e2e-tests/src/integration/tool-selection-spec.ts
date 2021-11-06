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

import { FeatureProperties, FrontendRoutes, MapTool, StyleProperties } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { ToolSelector } from '../helpers/ToolSelector';
import { Draw } from '../helpers/Draw';
import { MainMap } from '../helpers/MainMap';
import { History } from '../helpers/History';

describe('Tool Selection', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can select', function () {
    cy.visit(FrontendRoutes.map().raw())
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
        expect(features[0].get(FeatureProperties.Selected)).undefined;
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950186, 4048111.897809295, -1118865.2444950186, 4048111.897809295]);
        expect(features[1].get(FeatureProperties.Selected)).equal(true);
        expect(features[2].get(FeatureProperties.Selected)).equal(true);
      });
  });

  it('user can duplicate selection then undo', function () {
    cy.visit(FrontendRoutes.map().raw())
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
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950186, 4048111.897809295, -1118865.2444950186, 4048111.897809295]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-629668.2634698907, 3558914.916784167, -629668.2634698907, 3558914.916784167]);
        expect(features[2].getGeometry()?.getExtent()).deep.equals([-140471.28244476253, 3069717.9357590387, -140471.28244476253, 3069717.9357590387]);
        expect(features[3].getGeometry()?.getExtent()).deep.equals([-336150.07485481387, 3265396.72816909, -336150.07485481387, 3265396.72816909]);
        expect(features[4].getGeometry()?.getExtent()).deep.equals([153046.9061703143, 2776199.747143962, 153046.9061703143, 2776199.747143962]);
      })
      .then(() => History.undo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(3);
      })
      .then(() => History.redo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(5);
      });
  });

  it('user can drag selection then undo', function () {
    cy.visit(FrontendRoutes.map().raw())
      .then(() => MainMap.fixedView())
      // Draw points
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      // Select them
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(100, 100, 400, 400))
      // Drag them
      .then(() => Draw.drag(200, 200, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([3283907.5847311337, -354660.9314168575, 3283907.5847311337, -354660.9314168575]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([3773104.565756262, -843857.9124419857, 3773104.565756262, -843857.9124419857]);
      })
      .then(() => History.undo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-629668.2634698907, 3558914.916784167, -629668.2634698907, 3558914.916784167]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-140471.28244476253, 3069717.9357590387, -140471.28244476253, 3069717.9357590387]);
      })
      .then(() => History.redo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([3283907.5847311337, -354660.9314168575, 3283907.5847311337, -354660.9314168575]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([3773104.565756262, -843857.9124419857, 3773104.565756262, -843857.9124419857]);
      });
  });

  it('user can drag duplicated features', function () {
    cy.visit(FrontendRoutes.map().raw())
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

        expect(features[0].getGeometry()?.getExtent()).deep.equals([-629668.2634698907, 3558914.916784167, -629668.2634698907, 3558914.916784167]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-140471.28244476253, 3069717.9357590387, -140471.28244476253, 3069717.9357590387]);
        expect(features[2].getGeometry()?.getExtent()).deep.equals([3283907.5847311337, -354660.9314168575, 3283907.5847311337, -354660.9314168575]);
        expect(features[3].getGeometry()?.getExtent()).deep.equals([3773104.565756262, -843857.9124419857, 3773104.565756262, -843857.9124419857]);
      });
  });

  it('user change stroke style then undo', function () {
    cy.visit(FrontendRoutes.map().raw())
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
      .then(() => History.undo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.StrokeColor]).equal('#FF5733');
      })
      .then(() => History.redo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.StrokeColor]).equal('rgba(208,2,27,1)');
      });
  });

  it('user change fill style then undo', function () {
    cy.visit(FrontendRoutes.map().raw())
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
      .then(() => History.undo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.FillColor1]).equal('#FFFFFF');
      })
      .then(() => History.redo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.FillColor1]).equal('rgba(208,2,27,1)');
      });
  });
});
