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
import { Download } from '../helpers/Download';
import { Toasts } from '../helpers/Toasts';
import { MainMap } from '../helpers/MainMap';
import { TopBar } from '../helpers/TopBar';
import { Routes } from '../helpers/Routes';

describe('Data store', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can search then download artefact', () => {
    cy.visit(Routes.dataStore().format())
      .get('[data-cy=data-store-search]')
      .type('countries')
      .type('{enter}')
      .get('[data-cy=artefact-name]')
      .should('contain', 'Countries of the world')
      .get('[data-cy=more-actions-menu]')
      .click()
      .get('[data-cy=download-artefact]')
      .click()
      .then(() => Download.fileAsBlob())
      .should(async (file) => {
        expect(file).not.undefined;
        expect(file.size).equal(1_577_455);
      });
  });

  it('User can search then add artefact to project', () => {
    cy.visit(Routes.dataStore().format())
      .get('[data-cy=data-store-search]')
      .type('countries')
      .type('{enter}')
      .get('[data-cy=artefact-name]')
      .should('contain', 'Countries of the world')
      .get('[data-cy=import-artefact]')
      .click()
      .then(() => Toasts.assertText('Import done !'))
      .then(() => TopBar.map())
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(3);
        expect(layers[2].name).match(/^Import n°1 of+/);

        const features = map.getActiveLayerFeatures();
        expect(features).length(252);
      });
  });

  it('User can search then show license', () => {
    cy.visit(Routes.dataStore().format())
      .get('[data-cy=data-store-search]')
      .type('countries')
      .type('{enter}')
      .get('[data-cy=artefact-name]')
      .should('contain', 'Countries of the world')
      .get('[data-cy=more-actions-menu]')
      .click()
      .get('[data-cy=show-license]')
      .click()
      .get('[data-cy=license-header]')
      .should('contain', 'Countries of the world : Licence');
  });
});
