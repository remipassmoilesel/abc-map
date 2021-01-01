import { TestHelper } from '../../helpers/TestHelper';
import { Registration } from '../../helpers/Registration';
import { FrontendRoutes } from '@abc-map/shared-entities';
import { Toasts } from '../../helpers/Toasts';
import { Login } from '../../helpers/Login';

describe('Login', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can login with correct password', function () {
    const user = Registration.newUser();
    Login.login(user);
  });

  it('User cannot login with incorrect password', function () {
    const user = Registration.newUser();
    user.password = 'wrong-password';

    cy.visit(FrontendRoutes.landing())
      .get('input[data-cy=login-email]')
      .type(user.email)
      .get('input[data-cy=login-password]')
      .type(user.password)
      .get('button[data-cy=login-button]')
      .click();

    Toasts.assertText('Vos identifiants sont incorrects');
  });
});
