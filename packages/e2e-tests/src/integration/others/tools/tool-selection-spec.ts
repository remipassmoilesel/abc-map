import { FeatureProperties, FrontendRoutes, MapTool } from '@abc-map/shared-entities';
import { TestHelper } from '../../../helpers/TestHelper';
import { ToolSelector } from '../../../helpers/ToolSelector';
import { Draw } from '../../../helpers/Draw';
import { MainMap } from '../../../helpers/MainMap';

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
        const features = map.getActiveLayerFeatures().sort((e) => e.get(FeatureProperties.Selected));

        expect(features).length(3);
        expect(features[0].get(FeatureProperties.Selected)).equal(false);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1118865.2444950184, 4048111.8978092954, -1118865.2444950184, 4048111.8978092954]);
        expect(features[1].get(FeatureProperties.Selected)).equal(true);
        expect(features[2].get(FeatureProperties.Selected)).equal(true);
      });
  });
});
