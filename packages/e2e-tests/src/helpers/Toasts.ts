export class Toasts {
  public static assertText(text: string): Cypress.Chainable<any> {
    return cy.get('.toast-container div').should((elem) => {
      expect(elem.text()).to.contains(text);
    });
  }
}
