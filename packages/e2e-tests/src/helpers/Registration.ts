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
import { Routes } from './Routes';
import { UrlHelper } from './UrlHelper';
import { customAlphabet } from 'nanoid';

const emailIdGenerator = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 15);
const defaultPassword = 'azerty1234';

export class Registration {
  public static getPassword() {
    return defaultPassword;
  }

  public static newEmail() {
    return `e2e-${emailIdGenerator()}@abc-map.fr`;
  }

  public static newUser(email: string): Chainable<any> {
    // We register user
    // We MUST use button on landing page
    return cy
      .visit(Routes.landing().format())
      .get('[data-cy=open-registration]')
      .click()
      .get('input[data-cy=email]')
      .type(email)
      .get('input[data-cy=password]')
      .type(defaultPassword)
      .get('input[data-cy=password-confirmation]')
      .type(defaultPassword)
      .get('button[data-cy=submit-registration]')
      .click()
      .get('button[data-cy=confirm-registration]')
      .click();
  }

  public static enableAccount(email: string): Chainable<any> {
    return cy
      .readFile(`emails/${email}.html`)
      .then((content) => {
        const activationLink = Cypress.$(content).find('a[data-cy=enable-account-link]').attr('href') || '';
        expect(activationLink).to.match(/^http:\/\/localhost:[0-9]+\/[a-z]{2}/);
        return cy.visit(UrlHelper.adaptToConfig(activationLink));
      })
      .get('[data-cy=account-enabled]')
      .should('contain', 'Your account is activated')
      .wait(600);
  }
}
