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

export class Toasts {
  public static assertText(text: string, timeout = 4000): Cypress.Chainable<string> {
    return cy
      .get('.abc-toast-container div', { timeout })
      .should((elem) => {
        expect(elem[0].innerText).to.contains(text);
      })
      .then((elem) => Toasts.dismiss(text).then(() => elem[0].innerText));
  }

  public static dismiss(text?: string): Cypress.Chainable<any> {
    const elem = cy.get('.abc-toast');
    if (text) {
      elem.contains(text);
    }
    return elem.click({ multiple: true });
  }
}
