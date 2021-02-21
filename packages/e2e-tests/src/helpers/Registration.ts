import { FrontendRoutes } from '@abc-map/shared-entities';
import * as uuid from 'uuid-random';
import { Toasts } from './Toasts';
import { RegisteredUser } from './RegisteredUser';

const defaultPassword = 'azerty1234';

export class Registration {
  public static newUser(enableAccount = true): RegisteredUser {
    const email = `e2e-${uuid()}@abcmap.fr`;

    // We register user
    cy.visit(FrontendRoutes.landing())
      .get('input[data-cy=registration-email]')
      .type(email)
      .get('input[data-cy=registration-password]')
      .type(defaultPassword)
      .get('button[data-cy=registration-submit]')
      .click();
    Toasts.assertText('Un email vient de vous être envoyé, vous devez activer votre compte');

    // Then we enable account
    if (enableAccount) {
      cy.readFile(`emails/${email}.html`)
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

    // Then we return registered user
    return { email, password: defaultPassword };
  }
}
