import Chainable = Cypress.Chainable;

export class History {
  public static undo(): Chainable<any> {
    return cy.get('[data-cy=undo').click();
  }

  public static redo(): Chainable<any> {
    return cy.get('[data-cy=redo').click();
  }
}
