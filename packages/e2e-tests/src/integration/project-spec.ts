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

import { LayerType, WmsMetadata } from '@abc-map/shared';
import { FrontendRoutes, ProjectHelper } from '@abc-map/shared';
import { Toasts } from '../helpers/Toasts';
import { TestHelper } from '../helpers/TestHelper';
import { Download } from '../helpers/Download';
import { TestData } from '../test-data/TestData';
import { MainMap } from '../helpers/MainMap';
import { LayerControls } from '../helpers/LayerControls';
import { WmsConstants } from '../helpers/WmsConstants';
import { Registration } from '../helpers/Registration';
import { Authentication } from '../helpers/Authentication';
import * as uuid from 'uuid-random';
import 'cypress-file-upload';

const PROJECT_PASSWORD = 'azerty1234';

describe('Project', function () {
  describe('As a visitor', function () {
    beforeEach(() => {
      TestHelper.init();
    });

    it('can create new project', function () {
      cy.visit(FrontendRoutes.map().raw())
        .get('[data-cy=new-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => Toasts.assertText('Nouveau projet créé'))
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers).length(2);
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
          expect(map.getActiveLayerMetadata()?.type).equal(LayerType.Vector);
        });
    });

    it('can rename project', function () {
      cy.visit(FrontendRoutes.map().raw())
        .get('[data-cy=rename-project]')
        .click()
        .get('[data-cy=modal-rename-input]')
        .clear()
        .type('My awesome project')
        .get('[data-cy=rename-modal-confirm]')
        .click()
        .get('[data-cy=project-name]')
        .should((elem) => {
          expect(elem.text()).equal('My awesome project');
        });
    });

    it('can export project', function () {
      cy.visit(FrontendRoutes.map().raw())
        .get('[data-cy=export-project]')
        .click()
        .then(() => Toasts.assertText('Export terminé !'))
        .then(() => Download.fileAsBlob())
        .should(async (downloaded) => {
          const helper = ProjectHelper.forFrontend();
          const projectA = await helper.extractManifest(downloaded);
          expect(projectA.metadata.id).not.undefined;
          expect(projectA.metadata.projection).deep.equals({ name: 'EPSG:3857' });
          expect(projectA.metadata.version).equals('0.3.0');
          expect(projectA.layers).length(2);
          expect(projectA.layers[0].type).equals(LayerType.Predefined);
          expect(projectA.layers[1].type).equals(LayerType.Vector);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can import project', function () {
      cy.visit(FrontendRoutes.map().raw())
        .get('[data-cy=import-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => TestData.projectSample1())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .then(() => Toasts.assertText('Projet importé !'))
        // Check project name
        .get('[data-cy=project-name]')
        .should((elem) => {
          expect(elem.text()).equal('Test project made on 28/12/2020');
        })
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers).length(2);
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
        });
    });

    it('can export project with credentials', function () {
      cy.visit(FrontendRoutes.map().raw())
        .then(() => LayerControls.addWmsLayerWithCredentials())
        .get('[data-cy=export-project]')
        .click()
        .get('[data-cy=password-input]')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirmation]')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirm]')
        .click()
        .then(() => Download.fileAsBlob())
        .should(async (downloaded) => {
          const project = await ProjectHelper.forFrontend().extractManifest(downloaded);
          expect(project.layers[2].type).equals(LayerType.Wms);
          expect((project.layers[2].metadata as WmsMetadata).remoteUrl).not.equal(WmsConstants.AUTHENTICATED_URL);
          expect((project.layers[2].metadata as WmsMetadata).remoteUrl).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).not.equal(WmsConstants.USERNAME);
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.password).not.equal(WmsConstants.PASSWORD);
          expect((project.layers[2].metadata as WmsMetadata).auth?.password).contains('encrypted:');
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can import project with credentials', function () {
      cy.visit(FrontendRoutes.map().raw())
        .get('[data-cy=import-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => TestData.projectSample2())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .get('[data-cy=password-input]')
        .should('be.empty')
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirm]')
        .click()
        .then(() => Toasts.assertText('Projet importé !'))
        // Check project name
        .get('[data-cy=project-name]')
        .should((elem) => {
          expect(elem.text()).equal('Test project with credentials made on 30/01/2021');
        })
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers).length(1);
          expect(layers[0].type).equal(LayerType.Wms);
        });
    });
  });

  describe('As a user', function () {
    beforeEach(() => {
      const email = Registration.newEmail();
      const password = Registration.getPassword();

      TestHelper.init()
        .then(() => Registration.newUser(email))
        .then(() => Registration.enableAccount(email))
        .then(() => Authentication.login(email, password));
    });

    afterEach(() => {
      Authentication.logout();
    });

    it('can store project online without credentials', function () {
      cy.visit(FrontendRoutes.map().raw())
        .get('[data-cy=save-project]')
        .click()
        .then(() => Toasts.assertText('Projet enregistré !'))
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can store project online with credentials', function () {
      cy.visit(FrontendRoutes.map().raw())
        // Create a project and store it online
        .then(() => LayerControls.addWmsLayerWithCredentials())
        .get('[data-cy=save-project]')
        .click()
        .get('[data-cy=password-input]')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirmation]')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirm]')
        .click()
        .then(() => Toasts.assertText('Projet enregistré !'))
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can load remote project', function () {
      cy.visit(FrontendRoutes.map().raw())
        // Create a project and store it online
        .get('[data-cy=save-project]')
        .click()
        .then(() => Toasts.assertText('Projet enregistré !'))
        .get('[data-cy=close-solicitation-modal]')
        .click()
        // Clean map
        .get('[data-cy=new-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        // Open remote project
        .get('[data-cy=remote-projects]')
        .click()
        .get('[data-cy=remote-project]')
        .eq(0)
        .click()
        .get('[data-cy=open-project-confirm]')
        .click()
        .then(() => Toasts.assertText('Projet ouvert !'))
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
        });
    });

    it('can load remote remote project with credentials', function () {
      cy.visit(FrontendRoutes.map().raw())
        // Create a project and store it online
        .then(() => LayerControls.addWmsLayerWithCredentials())
        .get('[data-cy=save-project]')
        .click()
        .get('[data-cy=password-input]')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirmation]')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirm]')
        .click()
        .then(() => Toasts.assertText('Projet enregistré !'))
        .get('[data-cy=close-solicitation-modal]')
        .click()
        // Clean map
        .get('[data-cy=new-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        // Open remote project
        .get('[data-cy=remote-projects]')
        .click()
        .get('[data-cy=remote-project]')
        .eq(0)
        .click()
        .get('[data-cy=project-password]')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=open-project-confirm]')
        .click()
        .then(() => Toasts.assertText('Projet ouvert !'))
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
          expect(layers[2].type).equal(LayerType.Wms);
        });
    });

    it('can delete project', function () {
      const projectName = uuid();
      cy.visit(FrontendRoutes.map().raw())
        // Rename project
        .get('[data-cy=rename-project]')
        .click()
        .get('[data-cy=modal-rename-input]')
        .clear()
        .type(projectName)
        .get('[data-cy=rename-modal-confirm]')
        .click()
        .get('[data-cy=project-name]')
        // Save project
        .get('[data-cy=save-project]')
        .click()
        .then(() => Toasts.assertText('Projet enregistré !'))
        .get('[data-cy=close-solicitation-modal]')
        .click()
        // Delete it
        .get('[data-cy=remote-projects]')
        .click()
        .get('[data-cy=delete-project]')
        .click()
        .get('[data-cy=confirm-deletion]')
        .click()
        .then(() => Toasts.assertText('Project supprimé !'))
        .get('[data-cy=remote-project]')
        .should('not.exist')
        .get('[data-cy=cancel-button]')
        .click();
    });
  });
});
