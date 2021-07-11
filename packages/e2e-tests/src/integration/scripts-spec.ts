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
import { FrontendRoutes } from '@abc-map/shared';
import { DataStore } from '../helpers/DataStore';
import { TopBar } from '../helpers/TopBar';

describe('Script module', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can execute sample script', () => {
    cy.visit(FrontendRoutes.dataProcessing().withoutOptionals())
      .get('[data-cy=scripts]')
      .click()
      .get('[data-cy=execute]')
      .click()
      .get('[data-cy=message]')
      .should('contain', 'Script exécuté sans erreurs')
      .get('[data-cy=output]')
      .should('contain', 'Layer OpenStreetMap: Not vector')
      .should('contain', 'Layer Géométries: 0 features');
  });

  it('User can update features', () => {
    const script = `\
const layerName = map.listLayers()[2].name;
map.findByName(layerName).getFeatures().forEach((f, i) => f.set('e2e', i))
map.findByName(layerName).getFeatures().forEach((f) => log(f.get('e2e')))
`;
    cy.visit(FrontendRoutes.dataProcessing().withoutOptionals())
      .then(() => DataStore.importByName('Pays du monde'))
      .then(() => TopBar.dataProcessing())
      .get('[data-cy=scripts]')
      .click()
      .get('#code-editor')
      .clear()
      .type(script)
      .get('[data-cy=execute]')
      .click()
      .get('[data-cy=message]')
      .should('contain', 'Script exécuté sans erreurs')
      .get('[data-cy=output]')
      .should('contain', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
  });
});
