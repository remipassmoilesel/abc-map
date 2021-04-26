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
