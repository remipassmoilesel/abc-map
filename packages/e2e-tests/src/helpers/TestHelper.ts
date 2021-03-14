import Chainable = Cypress.Chainable;

export class TestHelper {
  public static init(): Chainable<any> {
    return cy.viewport(1980, 1080);
  }
}
