import { StyleProperties } from '@abc-map/shared-entities';
import { FrontendRoutes, MapTool } from '@abc-map/frontend-commons';
import { TestHelper } from '../../../helpers/TestHelper';
import { ToolSelector } from '../../../helpers/ToolSelector';
import { Draw } from '../../../helpers/Draw';
import { MainMap } from '../../../helpers/MainMap';
import { PointIcons } from '@abc-map/shared-entities';

describe('Tool Point', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can draw', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getType()).equal('Point');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950184, 4048111.8978092954, -1118865.2444950184, 4048111.8978092954]);
        expect(features[0].get(StyleProperties.PointSize)).equal(15);
        expect(features[0].get(StyleProperties.PointColor)).equal('#3F37C9');
        expect(features[0].get(StyleProperties.PointIcon)).equal(PointIcons.Circle);

        expect(features[1].getGeometry()?.getType()).equal('Point');
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-629668.2634698902, 3558914.9167841673, -629668.2634698902, 3558914.9167841673]);
        expect(features[0].get(StyleProperties.PointSize)).equal(15);
        expect(features[0].get(StyleProperties.PointColor)).equal('#3F37C9');
        expect(features[0].get(StyleProperties.PointIcon)).equal(PointIcons.Circle);
      });
  });

  it('user can move', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Point))
      // Create point
      .then(() => Draw.click(100, 100))
      // Select it
      .then(() => Draw.click(100, 100, { ctrlKey: true }))
      // Modify it
      .then(() => Draw.drag(100, 100, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(1);
        expect(features[0].getGeometry()?.getType()).equal('Point');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([3773104.565756262, -843857.9124419848, 3773104.565756262, -843857.9124419848]);
      });
  });
});
