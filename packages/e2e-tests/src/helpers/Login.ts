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
import { E2eUser } from './E2eUser';
import Chainable = Cypress.Chainable;
import { Toasts } from './Toasts';

export class Login {
  public static login(user: E2eUser): Chainable<any> {
    return cy
      .visit(FrontendRoutes.landing())
      .get('input[data-cy=login-email]')
      .type(user.email)
      .get('input[data-cy=login-password]')
      .type(user.password)
      .get('button[data-cy=login-button]')
      .click()
      .then(() => Toasts.assertText('Vous êtes connecté !'));
  }
}
