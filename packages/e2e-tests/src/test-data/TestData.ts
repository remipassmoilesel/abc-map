import Chainable = Cypress.Chainable;

const root = 'src/test-data';

/**
 * Sample data used for tests. We do not use fixtures as it does not support all formats.
 */
export class TestData {
  /**
   * Basic sample project
   */
  public static projectSample1(): Chainable<Blob> {
    return cy.readFile(`${root}/test-project-1.abm2`, 'base64').then((str) => Cypress.Blob.base64StringToBlob(str));
  }

  /**
   * Sample project with credentials
   */
  public static projectSample2(): Chainable<Blob> {
    return cy.readFile(`${root}/test-project-2.abm2`, 'base64').then((str) => Cypress.Blob.base64StringToBlob(str));
  }

  public static sampleGpx(): Chainable<Blob> {
    return cy.readFile(`${root}/campings-bretagne.gpx`, 'base64').then((str) => Cypress.Blob.base64StringToBlob(str));
  }

  public static countriesCsv(): Chainable<Blob> {
    return cy.readFile(`${root}/countries.csv`, 'base64').then((str) => Cypress.Blob.base64StringToBlob(str));
  }
}
