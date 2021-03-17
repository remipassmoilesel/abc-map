import { FeatureProperties, StyleProperties } from '@abc-map/shared-entities';
import { FrontendRoutes, MapTool } from '@abc-map/frontend-shared';
import { TestHelper } from '../../../helpers/TestHelper';
import { ToolSelector } from '../../../helpers/ToolSelector';
import { Draw } from '../../../helpers/Draw';
import { MainMap } from '../../../helpers/MainMap';
import { History } from '../../../helpers/History';

describe('Tool Selection', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can select', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Point))
      // First
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(150, 150, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(3);
        expect(features[0].get(FeatureProperties.Selected)).undefined;
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950184, 4048111.8978092954, -1118865.2444950184, 4048111.8978092954]);
        expect(features[1].get(FeatureProperties.Selected)).equal(true);
        expect(features[2].get(FeatureProperties.Selected)).equal(true);
      });
  });

  it('user can delete selection then undo', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Point))
      // First
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(150, 150, 600, 600))
      .get('[data-cy=delete-selection]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(1);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950184, 4048111.8978092954, -1118865.2444950184, 4048111.8978092954]);
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
        expect(features).length(1);
      });
  });

  it('user can duplicate selection then undo', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Point))
      // First
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(150, 150, 600, 600))
      .get('[data-cy=duplicate-selection]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(5);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950184, 4048111.8978092954, -1118865.2444950184, 4048111.8978092954]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-629668.2634698902, 3558914.9167841673, -629668.2634698902, 3558914.9167841673]);
        expect(features[2].getGeometry()?.getExtent()).deep.equals([-140471.28244476253, 3069717.9357590396, -140471.28244476253, 3069717.9357590396]);
        expect(features[3].getGeometry()?.getExtent()).deep.equals([-336150.0748548134, 3265396.7281690906, -336150.0748548134, 3265396.7281690906]);
        expect(features[4].getGeometry()?.getExtent()).deep.equals([153046.9061703143, 2776199.747143963, 153046.9061703143, 2776199.747143963]);
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
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
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
        expect(features[0].getGeometry()?.getExtent()).deep.equals([3283907.584731134, -354660.93141685706, 3283907.584731134, -354660.93141685706]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([3773104.565756262, -843857.9124419848, 3773104.565756262, -843857.9124419848]);
      })
      .then(() => History.undo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-629668.2634698902, 3558914.9167841673, -629668.2634698902, 3558914.9167841673]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-140471.28244476253, 3069717.9357590396, -140471.28244476253, 3069717.9357590396]);
      })
      .then(() => History.redo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([3283907.584731134, -354660.93141685706, 3283907.584731134, -354660.93141685706]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([3773104.565756262, -843857.9124419848, 3773104.565756262, -843857.9124419848]);
      });
  });

  it('user can drag duplicated features', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
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

        expect(features[0].getGeometry()?.getExtent()).deep.equals([-629668.2634698902, 3558914.9167841673, -629668.2634698902, 3558914.9167841673]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-140471.28244476253, 3069717.9357590396, -140471.28244476253, 3069717.9357590396]);
        expect(features[2].getGeometry()?.getExtent()).deep.equals([3283907.584731134, -354660.93141685706, 3283907.584731134, -354660.93141685706]);
        expect(features[3].getGeometry()?.getExtent()).deep.equals([3773104.565756262, -843857.9124419848, 3773104.565756262, -843857.9124419848]);
      });
  });

  it('user change stroke style then undo', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Circle))
      // Draw feature then select
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(50, 50, 400, 400))
      .get('[data-cy=stroke-color] button')
      .click()
      .get('div[title="#D0021B"]')
      .click()
      .get('[data-cy=close-modal]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.StrokeColor]).equal('#d0021b');
      })
      .then(() => History.undo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.StrokeColor]).equal('#3F37C9');
      })
      .then(() => History.redo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.StrokeColor]).equal('#d0021b');
      });
  });

  it('user change fill style then undo', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Circle))
      // Draw feature then select
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(200, 200))
      .then(() => ToolSelector.enable(MapTool.Selection))
      .then(() => Draw.drag(50, 50, 400, 400))
      .get('[data-cy=fill-color1] button')
      .click()
      .get('div[title="#D0021B"]')
      .click()
      .get('[data-cy=close-modal]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features[0].getProperties()[StyleProperties.FillColor1]).equal('#d0021b');
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
        expect(features[0].getProperties()[StyleProperties.FillColor1]).equal('#d0021b');
      });
  });
});
