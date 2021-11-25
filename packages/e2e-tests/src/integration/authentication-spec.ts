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
import { Routes } from '../helpers/Routes';

describe('Authentication', function () {
  beforeEach(() => {
    return cy.clearLocalStorage().then(() => TestHelper.init());
  });

  describe('As a visitor', () => {
    it('can register and enable account', function () {
      const email = Registration.newEmail();
      Registration.newUser(email).then(() => Registration.enableAccount(email));
    });

    it('can login on enabled account with correct password', function () {
      const email = Registration.newEmail();
      const password = Registration.getPassword();
      Registration.newUser(email)
        .then(() => Registration.enableAccount(email))
        .then(() => Authentication.login(email, password))
        .then(() => Authentication.logout());
    });

    it('cannot login if account is not enabled', function () {
      const email = Registration.newEmail();
      const password = Registration.getPassword();
      Registration.newUser(email)
        .get('[data-cy=open-login]')
        .click()
        .get('input[data-cy=email]')
        .type(email)
        .get('input[data-cy=password]')
        .type(password)
        .get('button[data-cy=confirm-login]')
        .click()
        .then(() => Toasts.assertText('Your login details are incorrect'));
    });

    it('cannot login with incorrect password', function () {
      const email = Registration.newEmail();
      Registration.newUser(email)
        .then(() => Registration.enableAccount(email))
        .visit(Routes.landing().format())
        .get('[data-cy=open-login]')
        .click()
        .get('input[data-cy=email]')
        .type(email)
        .get('input[data-cy=password]')
        .type('wrong-password-123')
        .get('button[data-cy=confirm-login]')
        .click()
        .then(() => Toasts.assertText('Your login details are incorrect'));
    });
  });

  describe('As a user', function () {
    it('can logout', function () {
      const email = Registration.newEmail();
      const password = Registration.getPassword();
      Registration.newUser(email)
        .then(() => Registration.enableAccount(email))
        .then(() => Authentication.login(email, password))
        .get('[data-cy=user-menu]')
        .click()
        .get('[data-cy=logout]')
        .click()
        .then(() => Toasts.assertText('You are disconnected'))
        .get('[data-cy=user-menu]')
        .click()
        .get('[data-cy=user-label]')
        .should((elem) => {
          expect(elem.text()).equal('Hello visitor !');
        });
    });
  });
});
