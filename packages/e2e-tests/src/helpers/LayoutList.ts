import Chainable = Cypress.Chainable;

export class LayoutList {
  public static getNames(): Chainable<string[]> {
    return cy.get('[data-cy=layout-list]').then(
      (elem) =>
        elem
          .find('[data-cy=list-item]')
          .toArray()
          .map((elem) => elem.textContent)
          .filter((s) => !!s) as string[]
    );
  }
}
