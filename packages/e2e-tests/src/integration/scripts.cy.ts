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

import { TestHelper } from '../helpers/TestHelper';
import { DataStore } from '../helpers/DataStore';
import { Routes } from '../helpers/Routes';
import { Modules } from '../helpers/Modules';

describe('Script module', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can execute sample script', () => {
    cy.visit(Routes.module().withParams({ moduleId: 'scripts' }))
      // We wait a little for project loading
      .wait(500)
      .get('[data-cy=execute]')
      .click()
      .get('[data-cy=message]')
      .should('contain', 'Script executed without errors')
      .get('[data-cy=output]')
      .contains('Layer OpenStreetMap is a Predefined layer.');
  });

  it('User can update features', () => {
    const script = `\
const mainMap = moduleApi.mainMap;
const layer = mainMap.getLayers()[2];
layer.getSource().getFeatures().forEach((f, i) => f.set('e2e', i));
layer.getSource().getFeatures().forEach((f) => log(f.get('e2e')));
`;

    DataStore.importByName('Countries of the world')
      .then(() => Modules.open('scripts'))
      .get('#code-editor')
      .clear()
      .type(script)
      .get('[data-cy=execute]')
      .click()
      .get('[data-cy=message]')
      .should('contain', 'Script executed without errors')
      .get('[data-cy=output]')
      .should('contain', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
  });
});
