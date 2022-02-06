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

import { TestHelper } from '../helpers/TestHelper';
import { Registration } from '../helpers/Registration';
import { Toasts } from '../helpers/Toasts';
import { UrlHelper } from '../helpers/UrlHelper';

describe('Reset password', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can recover password', function () {
    const email = Registration.newEmail();

    // Create account
    Registration.newUser(email)
      .then(() => Registration.enableAccount(email))
      .get('[data-cy=user-menu]')
      .click()
      // Logout
      .get('[data-cy=logout]')
      .click()
      // Password reset form
      .get('[data-cy=user-menu]')
      .click()
      .get('[data-cy=reset-password]')
      .click()
      .get('[data-cy=email]')
      .type(email)
      .get('[data-cy=confirm-reset-password]')
      .click()
      .then(() => Toasts.assertText('Email sent ! Remember to check your spam'))
      // Read reset password mail then visit link
      .readFile(`emails/${email}.html`)
      .then((content) => {
        const resetLink = Cypress.$(content).find('a[data-cy=reset-password-link]').attr('href') || '';
        expect(resetLink).to.match(/^http:\/\/localhost:[0-9]+\/[a-z]{2}\/reset-password\//);
        return cy.visit(UrlHelper.adaptToConfig(resetLink));
      })
      // Fill form reset password form
      .get('[data-cy=new-password]')
      .type('qwerty987')
      .get('[data-cy=confirmation]')
      .type('qwerty987')
      .get('[data-cy=reset-password]')
      .click()
      .then(() => Toasts.assertText('Password reset !'))
      // Finally, login
      .get('input[data-cy=email]')
      .type(email)
      .get('input[data-cy=password]')
      .type('qwerty987')
      .get('button[data-cy=confirm-login]')
      .click()
      .then(() => Toasts.assertText('You are connected !'));
  });
});
