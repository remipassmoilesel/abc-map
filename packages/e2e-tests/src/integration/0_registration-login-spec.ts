import { TestHelper } from '../helpers/TestHelper';
import { Registration } from '../helpers/Registration';
import { FrontendRoutes } from '@abc-map/shared-entities';
import { Toasts } from '../helpers/Toasts';
import { Login } from '../helpers/Login';

describe('Registration and login', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can register and enable account', function () {
    Registration.newUser();
  });

  it('User can login if account is enabled', function () {
    const user = Registration.newUser();
    Login.login(user);
  });

  it('User can not login if account is not enabled', function () {
    const user = Registration.newUser(false);
    cy.visit(FrontendRoutes.landing())
      .get('input[data-cy=login-email]')
      .type(user.email)
      .get('input[data-cy=login-password]')
      .type(user.password)
      .get('button[data-cy=login-button]')
      .click();

    Toasts.assertText('Vous devez activer votre compte avant de vous connecter');
  });
});
