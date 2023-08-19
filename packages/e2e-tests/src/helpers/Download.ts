/**
 * Copyright © 2023 Rémi Pace.
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

export class Download {
  /**
   * Return the last file downloaded if any
   */
  public static currentFileAsBlob(): Cypress.Chainable<Blob> {
    return cy.get('[data-cy=file-output]').then(
      (anchor) =>
        new Cypress.Promise<Blob>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', anchor.prop('href'), true);
          xhr.responseType = 'blob';
          xhr.onload = () => resolve(xhr.response);
          xhr.onerror = (err) => reject(err);
          xhr.send();
        })
    );
  }

  /**
   * Write the last file downloaded if any
   */
  public static writeCurrentFile(path: string): Cypress.Chainable<null> {
    return Download.currentFileAsBlob()
      .then((content) => content.arrayBuffer())
      .then((content) => cy.writeFile(path, Buffer.from(content)));
  }
}
