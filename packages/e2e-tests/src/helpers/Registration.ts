import { FrontendRoutes } from '@abc-map/frontend-shared';
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
              expect(activationLink).to.contains('http://localhost:3005/confirm-account/');
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
