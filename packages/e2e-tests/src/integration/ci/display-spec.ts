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

import { FrontendRoutes } from '@abc-map/shared';

describe('Display', function () {
  it('Too small display should warn', function () {
    cy.viewport(500, 500)
      .visit(FrontendRoutes.map().raw())
      .get('[data-cy=device-warning]')
      .should('exist')
      .get('[data-cy=device-warning-confirm]')
      .click()
      .get('[data-cy=device-warning]')
      .should('not.exist');
  });

  it('Correct display should warn', function () {
    cy.viewport(1980, 1080)
      .visit(FrontendRoutes.map().raw())
      .wait(1000) // We must wait here in order to let appear modal
      .get('[data-cy=device-warning]')
      .should('not.exist');
  });
});
