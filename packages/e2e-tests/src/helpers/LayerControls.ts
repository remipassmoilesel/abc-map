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

import { WmsConstants } from './WmsConstants';
import { WmtsConstants } from './WmtsConstants';
import { XyzConstants } from './XyzConstants';

export class LayerControls {
  public static getNames(): Cypress.Chainable<string[]> {
    return cy.get('[data-cy=layers-list] [data-cy=list-item]').then((elem) => {
      return elem.toArray().map((node) => node.textContent || '');
    });
  }

  public static getActiveItem() {
    return cy.get('[data-cy=layers-list] [data-cy=list-item][data-layer=active]');
  }

  public static deleteActiveLayer() {
    return (
      cy
        .get('[data-cy=delete-layer]')
        .click()
        // Wait for UI updates
        .wait(600)
    );
  }

  public static addOsmLayer(): Cypress.Chainable<any> {
    return cy
      .get('[data-cy=add-layer]')
      .click()
      .get('[data-cy=add-layer-type]')
      .select('Predefined basemap')
      .get('[data-cy=predefined-model]')
      .select('OpenStreetMap')
      .get('[data-cy=add-layer-confirm]')
      .click();
  }

  public static addVectorLayer(): Cypress.Chainable<any> {
    const option = 'Geometry layer';
    return cy.get('[data-cy=add-layer]').click().get('[data-cy=add-layer-type]').select(option).get('[data-cy=add-layer-confirm]').click();
  }

  public static addWmtsLayer(): Cypress.Chainable<any> {
    return (
      cy
        // Open add layer modal
        .get('[data-cy=add-layer]')
        .click()
        // Fill WMS layer form
        .get('[data-cy=add-layer-type]')
        .select('WMTS layer')
        .get('[data-cy=wmts-settings-url]')
        .clear()
        .type(WmtsConstants.PUBLIC_URL)
        // Get capabilities
        .get('[data-cy=wmts-settings-capabilities]')
        .click()
        // Select WMS layer
        .get('[data-cy=wmts-layer-item]')
        .eq(0)
        .click()
        // Add layer
        .get('[data-cy=add-layer-confirm]')
        .click()
    );
  }

  public static addWmsLayer(): Cypress.Chainable<any> {
    return (
      cy
        // Open add layer modal
        .get('[data-cy=add-layer]')
        .click()
        // Fill WMS layer form
        .get('[data-cy=add-layer-type]')
        .select('WMS layer')
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

  public static addXyzLayer(): Cypress.Chainable<any> {
    return (
      cy
        // Open add layer modal
        .get('[data-cy=add-layer]')
        .click()
        // Fill XYZ layer form
        .get('[data-cy=add-layer-type]')
        .select('XYZ layer')
        .get('[data-cy=xyz-settings-url]')
        .clear()
        .type(XyzConstants.PUBLIC_URL, { parseSpecialCharSequences: false })
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
        .select('WMS layer')
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
