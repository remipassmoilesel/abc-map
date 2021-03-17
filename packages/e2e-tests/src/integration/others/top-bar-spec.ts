import { FrontendRoutes } from '@abc-map/frontend-shared';
import { TopBar } from '../../helpers/TopBar';
import { TestHelper } from '../../helpers/TestHelper';

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
      // Layout
      .then(() => TopBar.layout())
      .get('[data-cy=format-select]')
      .should('exist')
      // Help
      .then(() => TopBar.help())
      .get('[data-cy=toc]')
      .should('contain', 'Sommaire')
      // About
      .then(() => TopBar.about())
      .get('[data-cy=punchline]')
      .should('exist');
  });
});
