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

import { FrontendRoutes } from '@abc-map/frontend-commons';
import { TestHelper } from '../../helpers/TestHelper';
import { Registration } from '../../helpers/Registration';
import { Login } from '../../helpers/Login';
import { Toasts } from '../../helpers/Toasts';

describe('Authentication', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  describe('As a visitor', () => {
    it('can register and enable account', function () {
      Registration.newUser();
    });

    it('can login with correct password', function () {
      Registration.newUser().then((user) => Login.login(user));
    });

    it('cannot login with incorrect password', function () {
      Registration.newUser().then((user) => {
        cy.visit(FrontendRoutes.landing())
          .get('input[data-cy=login-email]')
          .type(user.email)
          .get('input[data-cy=login-password]')
          .type('wrong-password')
          .get('button[data-cy=login-button]')
          .click()
          .then(() => Toasts.assertText('Vos identifiants sont incorrects'));
      });
    });

    it('can login if account is enabled', function () {
      Registration.newUser().then((user) => {
        return Login.login(user)
          .then(() => Toasts.assertText('Vous êtes connecté'))
          .get('[data-cy=user-menu]')
          .click()
          .get('[data-cy=user-label]')
          .should((elem) => {
            expect(elem.text()).equal(user.email);
          });
      });
    });

    it('cannot login if account is not enabled', function () {
      Registration.newUser(false)
        .then((user) => {
          return cy
            .visit(FrontendRoutes.landing())
            .get('input[data-cy=login-email]')
            .type(user.email)
            .get('input[data-cy=login-password]')
            .type(user.password)
            .get('button[data-cy=login-button]')
            .click();
        })
        .then(() => Toasts.assertText('Vous devez activer votre compte avant de vous connecter'));
    });
  });

  describe('As a user', function () {
    it('can logout', function () {
      Registration.newUser()
        .get('[data-cy=user-menu]')
        .click()
        .get('[data-cy=logout]')
        .click()
        .then(() => Toasts.assertText("Vous n'êtes plus connecté !"))
        .get('[data-cy=user-menu]')
        .click()
        .get('[data-cy=user-label]')
        .should((elem) => {
          expect(elem.text()).equal('Visiteur');
        });
    });
  });
});
