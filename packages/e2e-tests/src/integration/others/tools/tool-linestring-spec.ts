import { StyleProperties } from '@abc-map/shared-entities';
import { FrontendRoutes, MapTool } from '@abc-map/frontend-shared';
import { TestHelper } from '../../../helpers/TestHelper';
import { ToolSelector } from '../../../helpers/ToolSelector';
import { Draw } from '../../../helpers/Draw';
import { MainMap } from '../../../helpers/MainMap';

describe('Tool LineString', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can draw', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.LineString))
      // First
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(100, 150))
      .then(() => Draw.dblclick(150, 100))
      // Second
      .then(() => Draw.click(300, 300))
      .then(() => Draw.click(350, 350))
      .then(() => Draw.click(300, 350))
      .then(() => Draw.dblclick(350, 300))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getType()).equal('LineString');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950184, 3558914.9167841673, -629668.2634698902, 4048111.8978092954]);
        expect(features[0].get(StyleProperties.StrokeWidth)).not.undefined;
        expect(features[0].get(StyleProperties.StrokeColor)).not.undefined;
        expect(features[0].get(StyleProperties.FillColor1)).not.undefined;

        expect(features[1].getGeometry()?.getType()).equal('LineString');
        expect(features[1].getGeometry()?.getExtent()).deep.equals([837922.6796054938, 1602126.9926836556, 1327119.6606306215, 2091323.9737087833]);
        expect(features[1].get(StyleProperties.StrokeWidth)).not.undefined;
        expect(features[1].get(StyleProperties.StrokeColor)).not.undefined;
        expect(features[1].get(StyleProperties.FillColor1)).not.undefined;
      });
  });

  it('user can modify', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.LineString))
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(100, 150))
      .then(() => Draw.dblclick(150, 100))
      .then(() => Draw.drag(100, 100, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features[0].getGeometry()?.getType()).equal('LineString');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950184, -843857.9124419848, 3773104.565756262, 4048111.8978092954]);
      });
  });
});
