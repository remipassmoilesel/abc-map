import { FrontendRoutes } from '@abc-map/shared-entities';
import { Fixtures } from '../../helpers/Fixtures';
import { MainMap } from '../../helpers/MainMap';

// TODO: terminate test
// TODO: add drag and drop test
// TODO: add undo/redo test

describe.skip('Data import', () => {
  it('User can import via graphical control', () => {
    cy.visit(FrontendRoutes.map())
      .get("data-cy='import-data'")
      .click()
      .get("data-cy='file-input'")
      .attachFile(Fixtures.SampleGpx)
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        expect(features).length(1);
      });
  });
});
