import { LayerType } from '@abc-map/shared-entities';
import { FrontendRoutes } from '@abc-map/frontend-shared';
import { TestHelper } from '../../helpers/TestHelper';
import { MainMap } from '../../helpers/MainMap';

describe('Wms layers', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can add WMS layers without authentication', () => {
    cy.visit(FrontendRoutes.map())
      // Open add layer dialog
      .get('[data-cy=add-layer]')
      .click()
      .get('[data-cy=add-layer-type]')
      .select('Couche distante (WMS)')
      .get('[data-cy=add-layer-confirm]')
      .should('be.disabled')
      // Enter URL, get capabilities
      .get('[data-cy=wms-settings-url]')
      .clear()
      .type('https://ahocevar.com/geoserver/wms')
      .get('[data-cy=wms-settings-capabilities]')
      .click()
      .wait(1000)
      // Select remote layer then add
      .get('[data-cy=wms-layer-item]')
      .eq(2)
      .click()
      .get('[data-cy=add-layer-confirm]')
      .click()
      // Ensure requests return correct code
      .intercept('GET', '**REQUEST=GetMap*')
      .as('wms')
      .wait('@wms')
      .should((req) => {
        const requestOk = req.response?.statusCode === 200 || req.response?.statusCode === 204;
        expect(requestOk).true;
      })
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(3);
        expect(layers[2].type).equal(LayerType.Wms);
      });
  });
});
