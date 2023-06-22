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
import { MainMenu } from '../helpers/MainMenu';
import { UrlHelper } from '../helpers/UrlHelper';

describe('Authentication', function () {
  beforeEach(() => {
    return TestHelper.init();
  });

  describe('As a visitor', () => {
    it('can register and enable account', function () {
      const email = Registration.newEmail();
      Registration.newUser(email)
        .then(() => Registration.enableAccount(email))
        .then(() => Authentication.logout());
    });

    it('can login on enabled account with correct password', function () {
      const email = Registration.newEmail();
      const password = Registration.getPassword();
      Registration.newUser(email)
        .then(() => Registration.enableAccount(email))
        .then(() => Authentication.logout())
        .then(() => Authentication.login(email, password))
        .then(() => Authentication.logout());
    });

    it('cannot login if account is not enabled', function () {
      const email = Registration.newEmail();
      const password = Registration.getPassword();
      Registration.newUser(email)
        .then(() => MainMenu.open())
        .get('[data-cy=main-menu] [data-cy=open-login]')
        .click()
        .get('input[data-cy=email]')
        .type(email)
        .get('input[data-cy=password]')
        .type(password)
        .get('button[data-cy=confirm-login]')
        .click()
        .then(() => Toasts.assertText('Your credentials are incorrect'));
    });

    it('cannot login with incorrect password', function () {
      const email = Registration.newEmail();
      Registration.newUser(email)
        .then(() => Registration.enableAccount(email))
        .then(() => Authentication.logout())
        .visit(Routes.landing().format())
        .then(() => MainMenu.open())
        .get('[data-cy=main-menu] [data-cy=open-login]')
        .click()
        .get('input[data-cy=email]')
        .type(email)
        .get('input[data-cy=password]')
        .type('wrong-password-123')
        .get('button[data-cy=confirm-login]')
        .click()
        .then(() => Toasts.assertText('Your credentials are incorrect'));
    });
  });

  describe('As a user', function () {
    let email: string;
    let password: string;
    beforeEach(() => {
      email = Registration.newEmail();
      password = Registration.getPassword();

      TestHelper.init()
        .then(() => Registration.newUser(email))
        .then(() => Registration.enableAccount(email));
    });

    it('can logout', function () {
      cy.get('[data-cy=user-label]')
        .should((elem) => {
          expect(elem.text()).equal(email);
        })
        .then(() => Authentication.logout())
        .then(() => MainMenu.open())
        .get('[data-cy=user-label]')
        .should((elem) => {
          expect(elem.text()).equal('Hello visitor !');
        });
    });

    it('user can change password then login', function () {
      MainMenu.open()
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
        .then(() => Authentication.logout())
        .wait(500)
        .then(() => Authentication.login(email, 'qwerty789'))
        .then(() => Authentication.logout());
    });

    it('user can delete account', function () {
      MainMenu.open()
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

    it('can reset password with an email', function () {
      Authentication.logout()
        // Password reset form
        .then(() => MainMenu.open())
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
        .get('[data-cy=confirm-new-password]')
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
});
