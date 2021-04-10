import { FrontendRoutes } from '@abc-map/frontend-shared';
import { TopBar } from '../../helpers/TopBar';
import { TestHelper } from '../../helpers/TestHelper';

/**
 * This test exist in order to ensure that lazy loaded modules can be loaded
 */

describe('Top bar', () => {
  beforeEach(() => {
    TestHelper.init();
  });

  it('All links should work', () => {
    cy.visit(FrontendRoutes.landing())
      // Map view
      .then(() => TopBar.map())
      .get('[data-cy=search-on-map')
      .should('exist')
      // Data store view
      .then(() => TopBar.dataStore())
      .get('[data-cy=data-store-search]')
      .should('exist')
      // Data processing view
      .then(() => TopBar.dataProcessing())
      .get('[data-cy=scripts]')
      .should('exist')
      // Layout
      .then(() => TopBar.layout())
      .get('[data-cy=format-select]')
      .should('exist')
      // Documentation
      .then(() => TopBar.documentation())
      .get('[data-cy=toc]')
      .should('contain', 'Sommaire');
  });
});
