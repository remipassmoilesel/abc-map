import { StyleProperties } from '@abc-map/shared-entities';
import { FrontendRoutes, MapTool } from '@abc-map/frontend-commons';
import { TestHelper } from '../../../helpers/TestHelper';
import { ToolSelector } from '../../../helpers/ToolSelector';
import { Draw } from '../../../helpers/Draw';
import { MainMap } from '../../../helpers/MainMap';

describe('Tool Text', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can add text', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Point))
      // Draw 2 points
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      // Add text
      .then(() => ToolSelector.enable(MapTool.Text))
      .then(() => Draw.click(150, 150))
      .get('[data-cy=text-box]')
      .clear()
      .type('A beautiful label')
      .get('[data-cy=text-box-backdrop]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].get(StyleProperties.TextValue)).undefined;
        expect(features[1].get(StyleProperties.TextValue)).equal('A beautiful label');
      });
  });
});
