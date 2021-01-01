export class LayerSelector {
  public static getNames(): Cypress.Chainable<string[]> {
    return cy.get('[data-cy=layers-list] .list-item').then((elem) => {
      return elem.toArray().map((node) => node.textContent || '');
    });
  }

  public static getActiveItem(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=layers-list] .list-item.active');
  }
}
