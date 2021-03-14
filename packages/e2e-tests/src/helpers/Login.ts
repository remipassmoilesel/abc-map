import { FrontendRoutes } from '@abc-map/frontend-shared';
import { RegisteredUser } from './RegisteredUser';
import Chainable = Cypress.Chainable;

export class Login {
  public static login(user: RegisteredUser): Chainable<any> {
    return cy
      .visit(FrontendRoutes.landing())
      .get('input[data-cy=login-email]')
      .type(user.email)
      .get('input[data-cy=login-password]')
      .type(user.password)
      .get('button[data-cy=login-button]')
      .click();
  }
}
