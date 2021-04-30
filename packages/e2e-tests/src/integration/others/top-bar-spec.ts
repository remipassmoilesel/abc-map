/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { FrontendRoutes } from '@abc-map/frontend-commons';
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
