/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

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

  /**
   * More complete project
   */
  public static projectSample3(): Chainable<Blob> {
    return cy.readFile(`${root}/test-project-3.abm2`, 'base64').then((str) => Cypress.Blob.base64StringToBlob(str));
  }

  public static sampleGpx(): Chainable<Blob> {
    return cy.readFile(`${root}/campings-bretagne.gpx`, 'base64').then((str) => Cypress.Blob.base64StringToBlob(str));
  }

  public static countriesCsv(): Chainable<Blob> {
    return cy.readFile(`${root}/countries.csv`, 'base64').then((str) => Cypress.Blob.base64StringToBlob(str));
  }
}
