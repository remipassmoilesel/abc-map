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

import { WmsConstants } from './WmsConstants';

export class LayerControls {
  public static getNames(): Cypress.Chainable<string[]> {
    return cy.get('[data-cy=layers-list] [data-cy=list-item]').then((elem) => {
      return elem.toArray().map((node) => node.textContent || '');
    });
  }

  public static getActiveItem() {
    return cy.get('[data-cy=layers-list] [data-cy=list-item][data-layer=active]');
  }

  public static addOsmLayer(): Cypress.Chainable<any> {
    return cy
      .get('[data-cy=add-layer]')
      .click()
      .get('[data-cy=add-layer-type]')
      .select('Fond de carte')
      .get('[data-cy=predefined-model]')
      .select('OpenStreetMap')
      .get('[data-cy=add-layer-confirm]')
      .click();
  }

  public static addVectorLayer(): Cypress.Chainable<any> {
    const option = 'Couche de formes';
    return cy.get('[data-cy=add-layer]').click().get('[data-cy=add-layer-type]').select(option).get('[data-cy=add-layer-confirm]').click();
  }

  public static addWmsLayer(): Cypress.Chainable<any> {
    return (
      cy
        // Open add layer modal
        .get('[data-cy=add-layer]')
        .click()
        // Fill WMS layer form
        .get('[data-cy=add-layer-type]')
        .select('Couche distante (WMS)')
        .get('[data-cy=add-layer-confirm]')
        .get('[data-cy=wms-settings-url]')
        .clear()
        .type(WmsConstants.PUBLIC_URL)
        // Get capabilities
        .get('[data-cy=wms-settings-capabilities]')
        .click()
        // Select WMS layer
        .get('[data-cy=wms-layer-item]')
        .eq(1)
        .click()
        // Add layer
        .get('[data-cy=add-layer-confirm]')
        .click()
    );
  }

  public static addWmsLayerWithCredentials(): Cypress.Chainable<any> {
    return (
      cy
        // Open add layer modal
        .get('[data-cy=add-layer]')
        .click()
        .get('[data-cy=add-layer-type]')
        .select('Couche distante (WMS)')
        // Fill WMS layer form
        .get('[data-cy=wms-settings-url]')
        .clear()
        .type(WmsConstants.AUTHENTICATED_URL)
        .get('[data-cy=wms-settings-username]')
        .clear()
        .type(WmsConstants.USERNAME)
        .get('[data-cy=wms-settings-password]')
        .clear()
        .type(WmsConstants.PASSWORD)
        // Get capabilities
        .get('[data-cy=wms-settings-capabilities]')
        .click()
        // Select remote layer then add
        .get('[data-cy=wms-layer-item]')
        .eq(1)
        .click()
        .get('[data-cy=add-layer-confirm]')
        .click()
    );
  }
}
