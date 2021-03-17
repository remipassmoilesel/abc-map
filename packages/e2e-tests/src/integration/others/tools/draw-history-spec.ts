import { ToolSelector } from '../../../helpers/ToolSelector';
import { FrontendRoutes, MapTool } from '@abc-map/frontend-shared';
import { TestHelper } from '../../../helpers/TestHelper';
import { MainMap } from '../../../helpers/MainMap';
import { Draw } from '../../../helpers/Draw';
import { History } from '../../../helpers/History';

describe('Draw features history', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can add feature then undo and redo', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Circle))
      // First circle
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      // Second circle
      .then(() => Draw.click(200, 200))
      .then(() => Draw.click(250, 250))
      // First undo
      .then(() => History.undo())
      .wait(800)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1810694.249732728, 3356282.8925715857, -427036.23925730854, 4739940.903047006]);
      })
      // Second undo
      .then(() => History.undo())
      .wait(800)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(0);
      })
      // First redo
      .then(() => History.redo())
      .wait(800)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1810694.249732728, 3356282.8925715857, -427036.23925730854, 4739940.903047006]);
      })
      // Second redo
      .then(() => History.redo())
      .wait(800)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(2);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1810694.249732728, 3356282.8925715857, -427036.23925730854, 4739940.903047006]);
        expect(features[1].getGeometry()?.getExtent()).deep.equals([-832300.2876824724, 2377888.93052133, 551357.7227929473, 3761546.9409967493]);
      });
  });

  it('user can modify feature then undo', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Circle))
      // First circle
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      // First modification
      .then(() => Draw.drag(150, 150, 200, 200))
      // Second modification
      .then(() => Draw.drag(100, 100, 400, 400))
      // First undo
      .then(() => History.undo())
      .wait(800)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-2502523.2549704374, 2664453.8873338765, 264792.7659804006, 5431769.908284714]);
      })
      // Second undo
      .then(() => History.undo())
      .wait(800)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-1810694.249732728, 3356282.8925715857, -427036.23925730854, 4739940.903047006]);
      })
      // First redo
      .then(() => History.redo())
      .wait(800)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([-2502523.2549704374, 2664453.8873338765, 264792.7659804006, 5431769.908284714]);
      })
      // Second redo
      .then(() => History.redo())
      .wait(800)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
        expect(features[0].getGeometry()?.getExtent()).deep.equals([432658.6311803311, -270727.99881689204, 3199974.652131169, 2496588.022133946]);
      });
  });
});
