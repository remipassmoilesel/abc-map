import Chainable = Cypress.Chainable;

export class MapHistory {
  public static undo(): Chainable<any> {
    return cy.get('[data-cy=map-undo').click();
  }

  public static redo(): Chainable<any> {
    return cy.get('[data-cy=map-redo').click();
  }
}
