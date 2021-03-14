import { FrontendRoutes } from '@abc-map/frontend-shared';

describe('Display', function () {
  it('Too small display should warn', function () {
    cy.viewport(500, 500)
      .visit(FrontendRoutes.map())
      .get('[data-cy=device-warning]')
      .should('exist')
      .get('[data-cy=device-warning-confirm]')
      .click()
      .get('[data-cy=device-warning]')
      .should('not.exist');
  });

  it('Correct display should warn', function () {
    cy.viewport(1980, 1080)
      .visit(FrontendRoutes.map())
      .wait(1000) // We must wait here in order to let appear modal
      .get('[data-cy=device-warning]')
      .should('not.exist');
  });
});
