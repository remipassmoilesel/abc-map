import Chainable = Cypress.Chainable;

export class TopBar {
  public static landing(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=landing]').click();
  }

  public static map(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=map]').click();
  }

  public static dataStore(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=data-store]').click();
  }

  public static layout(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=layout]').click();
  }

  public static help(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=help]').click();
  }

  public static about(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=about]').click();
  }
}
