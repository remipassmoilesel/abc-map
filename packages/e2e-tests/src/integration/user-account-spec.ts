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
import { Authentication } from '../helpers/Authentication';
import { Toasts } from '../helpers/Toasts';

describe('User account', function () {
  let email: string;
  let password: string;
  beforeEach(() => {
    email = Registration.newEmail();
    password = Registration.getPassword();

    TestHelper.init()
      .then(() => Registration.newUser(email))
      .then(() => Registration.enableAccount(email))
      .then(() => Authentication.login(email, password));
  });

  it('user can change password then login', function () {
    cy.get('[data-cy=user-menu]')
      .click()
      .get('[data-cy=user-profile]')
      .click()
      .get('[data-cy=change-password-old-password')
      .type(password)
      .get('[data-cy=change-password-new-password]')
      .type('qwerty789')
      .get('[data-cy=change-password-confirmation]')
      .type('qwerty789')
      .get('[data-cy=change-password-button]')
      .click()
      .then(() => Toasts.assertText('Password updated !'))
      .get('[data-cy=user-menu]')
      .click()
      .get('[data-cy=logout]')
      .click()
      .wait(500)
      .then(() => Authentication.login(email, 'qwerty789'))
      .then(() => Authentication.logout());
  });

  it('user can delete account', function () {
    cy.get('[data-cy=user-menu]')
      .click()
      .get('[data-cy=user-profile]')
      .click()
      .get('[data-cy=delete-account-checkbox')
      .click()
      .get('[data-cy=delete-account-password')
      .type(password)
      .get('[data-cy=delete-account-button]')
      .click()
      .then(() => Toasts.assertText('Your account has been deleted'));
  });
});
