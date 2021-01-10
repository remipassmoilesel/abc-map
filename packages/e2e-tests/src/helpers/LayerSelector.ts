export class LayerSelector {
  public static getNames(): Cypress.Chainable<string[]> {
    return cy.get('[data-cy=layers-list] .abc-layer-item').then((elem) => {
      return elem.toArray().map((node) => node.textContent || '');
    });
  }

  public static getActiveItem(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=layers-list] .abc-layer-item.active');
  }

  public static addLayer(type: 'Osm' | 'Vector'): Cypress.Chainable<any> {
    let option: string;
    if (type === 'Osm') {
      option = 'Couche OpenStreetMap';
    } else if (type === 'Vector') {
      option = 'Couche de formes';
    } else {
      throw new Error(`Unknown type: ${type}`);
    }
    return cy.get('[data-cy=add-layer]').click().get('[data-cy=add-layer-type]').select(option).get('[data-cy=add-layer-confirm]').click();
  }
}
