export class ExperimentalFeatures {
  public static enableMapSharing(): Cypress.Chainable<any> {
    return cy
      .get('[data-cy=user-menu]')
      .click()
      .get('[data-cy=experimental-features]')
      .click()
      .get('[data-cy=MapSharing]')
      .click()
      .get('[data-cy=close-modal]')
      .click();
  }
}
