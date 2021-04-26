import { TestHelper } from '../../helpers/TestHelper';
import { FrontendRoutes } from '@abc-map/frontend-commons';
import { MainMap } from '../../helpers/MainMap';

describe('Search on map', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can search', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => MainMap.getComponent())
      .get('[data-cy=search-on-map]')
      .clear()
      .type('Cournonterral')
      .wait(1_000)
      .get('[data-cy=search-result]')
      .eq(1)
      .click()
      .wait(2_000)
      .then(() => MainMap.getReference())
      .should((map) => {
        const extent = map.getViewExtent();
        expect(extent).deep.equals([414110.67357591685, 5397227.23333822, 414132.8319648471, 5397242.594491627]);
      });
  });
});
