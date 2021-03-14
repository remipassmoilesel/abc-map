import { TestHelper } from '../../helpers/TestHelper';
import { FrontendRoutes } from '@abc-map/frontend-shared';

describe('Documentation', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('Visitor can display documentation', function () {
    cy.visit(FrontendRoutes.help()).get('[data-cy=toc]').should('contain', 'Sommaire');
  });
});
