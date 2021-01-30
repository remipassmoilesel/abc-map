import { Env } from './Env';

export class LayerSelector {
  public static getNames(): Cypress.Chainable<string[]> {
    return cy.get('[data-cy=layers-list] .abc-layer-item').then((elem) => {
      return elem.toArray().map((node) => node.textContent || '');
    });
  }

  public static getActiveItem(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=layers-list] .abc-layer-item.active');
  }

  public static addOsmLayer(): Cypress.Chainable<any> {
    const option = 'Couche OpenStreetMap';
    return cy.get('[data-cy=add-layer]').click().get('[data-cy=add-layer-type]').select(option).get('[data-cy=add-layer-confirm]').click();
  }

  public static addVectorLayer(): Cypress.Chainable<any> {
    const option = 'Couche de formes';
    return cy.get('[data-cy=add-layer]').click().get('[data-cy=add-layer-type]').select(option).get('[data-cy=add-layer-confirm]').click();
  }

  public static addWmsLayer(): Cypress.Chainable<any> {
    return cy
      .get('[data-cy=add-layer]')
      .click()
      .get('[data-cy=add-layer-type]')
      .select('Couche distante (WMS)')
      .get('[data-cy=add-layer-confirm]')
      .get('[data-cy=wms-settings-url]')
      .clear()
      .type('https://ahocevar.com/geoserver/wms')
      .get('[data-cy=wms-settings-capabilities]')
      .click()
      .get('[data-cy=wms-layer-item]')
      .eq(2)
      .click()
      .get('[data-cy=add-layer-confirm]')
      .click();
  }

  public static addWmsLayerWithCredentials(): Cypress.Chainable<any> {
    return (
      cy
        .get('[data-cy=add-layer]')
        .click()
        .get('[data-cy=add-layer-type]')
        .select('Couche distante (WMS)')
        .get('[data-cy=add-layer-confirm]')
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
        .get('[data-cy=wms-layer-item]')
        .eq(2)
        .click()
        .get('[data-cy=add-layer-confirm]')
        .click()
    );
  }
}
