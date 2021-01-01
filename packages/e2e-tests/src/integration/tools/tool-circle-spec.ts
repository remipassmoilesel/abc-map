import { FrontendRoutes, MapTool, StyleProperties } from '@abc-map/shared-entities';
import { TestHelper } from '../../helpers/TestHelper';
import { ToolSelector } from '../../helpers/ToolSelector';
import { Draw } from '../../helpers/Draw';
import { MainMap } from '../../helpers/MainMap';

describe('Tool Circle', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can draw', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Circle))
      // First circle
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      // Second circle
      .then(() => Draw.click(200, 200))
      .then(() => Draw.click(250, 250))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].getGeometry()?.getType()).equal('Circle');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1810694.249732728, 3356282.8925715857, -427036.23925730854, 4739940.903047006]);
        expect(features[0].get(StyleProperties.StrokeWidth)).not.undefined;
        expect(features[0].get(StyleProperties.StrokeColor)).not.undefined;
        expect(features[0].get(StyleProperties.FillColor)).not.undefined;

        expect(features[1].getGeometry()?.getType()).equal('Circle');
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-832300.2876824724, 2377888.93052133, 551357.7227929473, 3761546.9409967493]);
        expect(features[1].get(StyleProperties.StrokeWidth)).not.undefined;
        expect(features[1].get(StyleProperties.StrokeColor)).not.undefined;
        expect(features[1].get(StyleProperties.FillColor)).not.undefined;
      });
  });

  it('user can move', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Circle))
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.drag(100, 100, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(1);
        expect(features[0].getGeometry()?.getType()).equal('Circle');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([3081275.5605185516, -1535686.917679695, 4464933.570993972, -152028.90720427455]);
      });
  });

  it('user can modify', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Circle))
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.drag(150, 150, 300, 300))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(1);
        expect(features[0].getGeometry()?.getType()).equal('Circle');
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-3886181.2654458573, 1280795.8768584565, 1648450.7764558205, 6815427.918760134]);
      });
  });
});
