import { ToolSelector } from '../../helpers/ToolSelector';
import { FrontendRoutes, MapTool } from '@abc-map/frontend-commons';
import { TestHelper } from '../../helpers/TestHelper';

describe('ToolSelector', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('selector should change current tool', () => {
    cy.visit(FrontendRoutes.map());

    for (const tool in MapTool) {
      cy.then(() => ToolSelector.enable(tool as MapTool))
        .then(() => ToolSelector.getActive())
        .should((active) => expect(active).equal(tool));
    }
  });
});
