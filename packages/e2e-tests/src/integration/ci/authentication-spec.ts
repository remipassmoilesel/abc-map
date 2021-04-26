import { FrontendRoutes } from '@abc-map/frontend-commons';
import { TestHelper } from '../../helpers/TestHelper';
import { Registration } from '../../helpers/Registration';
import { Login } from '../../helpers/Login';
import { Toasts } from '../../helpers/Toasts';

describe('Authentication', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  describe('As a visitor', () => {
    it('can register and enable account', function () {
      Registration.newUser();
    });

    it('can login with correct password', function () {
      Registration.newUser().then((user) => Login.login(user));
    });

    it('cannot login with incorrect password', function () {
      Registration.newUser().then((user) => {
        cy.visit(FrontendRoutes.landing())
          .get('input[data-cy=login-email]')
          .type(user.email)
          .get('input[data-cy=login-password]')
          .type('wrong-password')
          .get('button[data-cy=login-button]')
          .click()
          .then(() => Toasts.assertText('Vos identifiants sont incorrects'));
      });
    });

    it('can login if account is enabled', function () {
      Registration.newUser().then((user) => {
        return Login.login(user)
          .then(() => Toasts.assertText('Vous êtes connecté'))
          .get('[data-cy=user-menu]')
          .click()
          .get('[data-cy=user-label]')
          .should((elem) => {
            expect(elem.text()).equal(user.email);
          });
      });
    });

    it('cannot login if account is not enabled', function () {
      Registration.newUser(false)
        .then((user) => {
          return cy
            .visit(FrontendRoutes.landing())
            .get('input[data-cy=login-email]')
            .type(user.email)
            .get('input[data-cy=login-password]')
            .type(user.password)
            .get('button[data-cy=login-button]')
            .click();
        })
        .then(() => Toasts.assertText('Vous devez activer votre compte avant de vous connecter'));
    });
  });

  describe('As a user', function () {
    it('can logout', function () {
      Registration.newUser()
        .get('[data-cy=user-menu]')
        .click()
        .get('[data-cy=logout]')
        .click()
        .then(() => Toasts.assertText("Vous n'êtes plus connecté !"))
        .get('[data-cy=user-menu]')
        .click()
        .get('[data-cy=user-label]')
        .should((elem) => {
          expect(elem.text()).equal('Visiteur');
        });
    });
  });
});
