import { FrontendRoutes, LayerType } from '@abc-map/shared-entities';
import { TestHelper } from '../../helpers/TestHelper';
import { MainMap } from '../../helpers/MainMap';
import { Env } from 'helpers/Env';

describe('Wms layers', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can add WMS layers without authentication', () => {
    cy.intercept('GET', '**REQUEST=GetMap*')
      .as('wms')
      .visit(FrontendRoutes.map())
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
      .wait('@wms')
      .should((req) => expect(req.response?.statusCode).equal(200))
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(3);
        expect(layers[2].type).equal(LayerType.Wms);
      });
  });

  it('User can add WMS layers with authentication', () => {
    cy.intercept('GET', '**REQUEST=GetMap*')
      .as('wms')
      .visit(FrontendRoutes.map())
      // Open add layer dialog
      .get('[data-cy=add-layer]')
      .click()
      .get('[data-cy=add-layer-type]')
      .select('Couche distante (WMS)')
      .get('[data-cy=add-layer-confirm]')
      .should('be.disabled')
      // Enter URL, credentials
      .get('[data-cy=wms-settings-url]')
      .clear()
      .type(Env.wmsUrl())
      .get('[data-cy=wms-settings-username]')
      .clear()
      .type(Env.wmsUsername())
      .get('[data-cy=wms-settings-password]')
      .clear()
      .type(Env.wmsPassword())
      // Get capabilities, select remote layer then add
      .get('[data-cy=wms-settings-capabilities]')
      .click()
      .wait(1000)
      .get('[data-cy=wms-layer-item]')
      .eq(2)
      .click()
      .get('[data-cy=add-layer-confirm]')
      .click()
      .wait('@wms')
      .should((req) => expect(req.response?.statusCode).equal(200))
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(3);
        expect(layers[2].type).equal(LayerType.Wms);
      });
  });
});
