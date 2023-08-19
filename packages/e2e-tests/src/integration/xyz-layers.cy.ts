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

import { LayerType } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { MainMap } from '../helpers/MainMap';
import { XyzConstants } from '../helpers/XyzConstants';
import { Routes } from '../helpers/Routes';

describe('XYZ layers', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can add XYZ layers', () => {
    cy.visit(Routes.map().format())
      // Open add layer dialog
      .get('[data-cy=add-layer]')
      .click()
      .get('[data-cy=add-layer-type]')
      .select('XYZ layer')
      .get('[data-cy=add-layer-confirm]')
      .should('be.disabled')
      // Enter URL
      .get('[data-cy=xyz-settings-url]')
      .clear()
      .type(XyzConstants.PUBLIC_URL, { parseSpecialCharSequences: false })
      .click()
      // Add layer
      .get('[data-cy=add-layer-confirm]')
      .click()
      // Ensure requests return correct code
      .intercept('GET', 'http://0.0.0.0:3010/xyz/**')
      .as('xyz')
      .wait('@xyz')
      .should((req) => {
        const requestOk = req.response?.statusCode === 200 || req.response?.statusCode === 204;
        expect(requestOk).true;
      })
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(3);
        expect(layers[2].type).equal(LayerType.Xyz);
      });
  });
});
