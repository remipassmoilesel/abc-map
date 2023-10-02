/**
 * Copyright © 2023 Rémi Pace.
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

import { TestHelper } from '../helpers/TestHelper';
import { Routes } from '../helpers/Routes';
import { Toasts } from '../helpers/Toasts';

describe('Script module', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can run example', () => {
    cy.visit(Routes.module().withParams({ moduleId: 'scripts' }))
      // We wait a little for project loading
      .wait(500)
      .get('[data-cy=load-example-buffers]')
      .click()
      .then(() => Toasts.assertText('Example loaded'))
      .get('[data-cy=execute]')
      .click()
      .get('[data-cy=message]')
      .should('contain', 'Script executed without errors');
  });
});
