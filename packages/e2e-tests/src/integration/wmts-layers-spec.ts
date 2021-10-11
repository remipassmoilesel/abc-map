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

import { LayerType } from '@abc-map/shared';
import { FrontendRoutes } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { MainMap } from '../helpers/MainMap';
import { WmtsConstants } from 'helpers/WmtsConstants';

describe('Wmts layers', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can add WMTS layers without authentication', () => {
    cy.visit(FrontendRoutes.map().raw())
      // Open add layer dialog
      .get('[data-cy=add-layer]')
      .click()
      .get('[data-cy=add-layer-type]')
      .select('WMTS layer')
      .get('[data-cy=add-layer-confirm]')
      .should('be.disabled')
      // Enter URL, get capabilities
      .get('[data-cy=wmts-settings-url]')
      .clear()
      .type(WmtsConstants.PUBLIC_URL)
      .get('[data-cy=wmts-settings-capabilities]')
      .click()
      // Select remote layer then add
      .get('[data-cy=wmts-layer-item]')
      .eq(0)
      .click()
      .get('[data-cy=add-layer-confirm]')
      .click()
      // Ensure requests return correct code
      .intercept('GET', '/wmts/public/layer=7328,style=39/**')
      .as('wmts')
      .wait('@wmts')
      .should((req) => {
        const requestOk = req.response?.statusCode === 200 || req.response?.statusCode === 204;
        expect(requestOk).true;
      })
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(3);
        expect(layers[2].type).equal(LayerType.Wmts);
      });
  });

  it('User can add WMTS layers with authentication', () => {
    cy.visit(FrontendRoutes.map().raw())
      // Open add layer dialog
      .get('[data-cy=add-layer]')
      .click()
      .get('[data-cy=add-layer-type]')
      .select('WMTS layer')
      .get('[data-cy=add-layer-confirm]')
      .should('be.disabled')
      // Enter URL, credentials
      .get('[data-cy=wmts-settings-url]')
      .clear()
      .type(WmtsConstants.AUTHENTICATED_URL)
      .get('[data-cy=wmts-settings-username]')
      .clear()
      .type(WmtsConstants.USERNAME)
      .get('[data-cy=wmts-settings-password]')
      .clear()
      .type(WmtsConstants.PASSWORD)
      // Get capabilities, select remote layer then add
      .get('[data-cy=wmts-settings-capabilities]')
      .click()
      .get('[data-cy=wmts-layer-item]')
      .eq(0)
      .click()
      .get('[data-cy=add-layer-confirm]')
      .click()
      .intercept('GET', '/wmts/authenticated/layer=7328,style=39/**')
      .as('wmts')
      .wait('@wmts')
      .should((req) => {
        const requestOk = req.response?.statusCode === 200 || req.response?.statusCode === 204;
        expect(requestOk).true;
      })
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(3);
        expect(layers[2].type).equal(LayerType.Wmts);
      });
  });
});
