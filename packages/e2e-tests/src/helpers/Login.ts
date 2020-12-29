import { FrontendRoutes } from '@abc-map/shared-entities';
import { RegisteredUser } from './RegisteredUser';
import { Toasts } from './Toasts';

export class Login {
  public static login(user: RegisteredUser) {
    cy.visit(FrontendRoutes.landing())
      .get('input[data-cy=login-email]')
      .type(user.email)
      .get('input[data-cy=login-password]')
      .type(user.password)
      .get('button[data-cy=login-button]')
      .click();
    Toasts.assertText('Vous êtes connecté');
  }
}
