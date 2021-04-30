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
import * as uuid from 'uuid-random';
import { Toasts } from './Toasts';
import { E2eUser } from './E2eUser';
import Chainable = Cypress.Chainable;

const defaultPassword = 'azerty1234';

export class Registration {
  public static newUser(enableAccount = true): Chainable<E2eUser> {
    const email = `e2e-${uuid().substr(24)}@abcmap.fr`;

    // We register user
    return cy
      .visit(FrontendRoutes.landing())
      .get('input[data-cy=registration-email]')
      .type(email)
      .get('input[data-cy=registration-password]')
      .type(defaultPassword)
      .get('button[data-cy=registration-submit]')
      .click()
      .then(() => Toasts.assertText('Un email vient de vous être envoyé, vous devez activer votre compte'))
      .then(() => {
        // Then we enable account
        if (enableAccount) {
          return cy
            .readFile(`emails/${email}.html`)
            .then((content) => {
              const activationLink = Cypress.$(content).find('a[data-cy=enable-account-link]').attr('href') || '';
              expect(activationLink).to.match(/^http:\/\/localhost:[0-9]+\/confirm-account\//);
              return cy.visit(activationLink);
            })
            .get('div[data-cy=account-enabled]')
            .should((elem) => {
              expect(elem.text()).to.contains('Votre compte est activé');
            });
        }
      })
      .then(() => ({ email, password: defaultPassword }));
  }
}
