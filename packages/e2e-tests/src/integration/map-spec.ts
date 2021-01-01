import { FrontendRoutes } from '@abc-map/shared-entities';
import { TestHelper } from '../helpers/TestHelper';
import { LayerSelector } from '../helpers/LayerSelector';

describe('Map', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  describe('With default map ', () => {
    it('should have two layers with one active', function () {
      cy.visit(FrontendRoutes.map())
        .then(() => LayerSelector.getNames())
        .should((names) => {
          expect(names).deep.equals(['- OpenStreetMap', '- Formes']);
        })
        .then(() => LayerSelector.getActiveItem())
        .should((elem) => {
          expect(elem.length).equals(1);
          expect(elem.text()).equals('- Formes');
        });
    });
  });
});
