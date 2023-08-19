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

import Chainable = Cypress.Chainable;
import { Toasts } from './Toasts';
import { MainMenu } from './MainMenu';

export class Authentication {
  public static login(email: string, password: string): Chainable<any> {
    return MainMenu.open()
      .get('[data-cy=main-menu] [data-cy=open-login]')
      .click()
      .get('input[data-cy=email]')
      .type(email)
      .get('input[data-cy=password]')
      .type(password)
      .get('button[data-cy=confirm-login]')
      .click()
      .then(() => Toasts.assertText('You are connected !'))
      .then(() => MainMenu.close());
  }

  public static logout(): Chainable<any> {
    return (
      MainMenu.open()
        .get('[data-cy=main-menu] [data-cy=logout]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => Toasts.assertText('You are disconnected'))
        .then(() => MainMenu.close())
        // We must wait a little for storage persistence
        .wait(700)
    );
  }
}
