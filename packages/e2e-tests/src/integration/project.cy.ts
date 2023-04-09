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

import { LayerType, ProjectConstants, ProjectHelper, WmsMetadata } from '@abc-map/shared';
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
import { Routes } from '../helpers/Routes';
import { Modules } from '../helpers/Modules';
import { TopBar } from '../helpers/TopBar';

const PROJECT_PASSWORD = 'azerty1234';

describe('Project', function () {
  describe('As a visitor', function () {
    beforeEach(() => {
      TestHelper.init();
    });

    it('can create new project', function () {
      cy.visit(Routes.map().format())
        .then(() => Modules.open('project-management'))
        .get('[data-cy=new-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => Toasts.assertText('New project !'))
        .then(() => TopBar.map())
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
      cy.visit(Routes.map().format())
        .then(() => Modules.open('project-management'))
        .get('[data-cy=edit-project-name]')
        .click()
        .get('[data-cy=prompt-input]')
        .clear()
        .type('My awesome project')
        .get('[data-cy=prompt-confirm]')
        .click()
        .get('[data-cy=project-name]')
        .should((elem) => {
          expect(elem.text()).equal('My awesome project');
        });
    });

    it('can export project', function () {
      cy.visit(Routes.map().format())
        .then(() => Modules.open('project-management'))
        .get('[data-cy=export-project]')
        .click()
        .then(() => Toasts.assertText('Export done !'))
        .then(() => Download.currentFileAsBlob())
        .should(async (downloaded) => {
          const helper = ProjectHelper.forBrowser();
          const projectA = await helper.extractManifest(downloaded);
          expect(projectA.metadata.id).not.undefined;
          expect(projectA.metadata.version).equals(ProjectConstants.CurrentVersion);
          expect(projectA.layers).length(2);
          expect(projectA.layers[0].type).equals(LayerType.Predefined);
          expect(projectA.layers[1].type).equals(LayerType.Vector);
          expect(projectA.view.projection).deep.equals({ name: 'EPSG:3857' });
          expect(projectA.view.resolution).not.undefined;
          expect(projectA.view.center).not.undefined;
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can import project', function () {
      cy.visit(Routes.map().format())
        .then(() => Modules.open('project-management'))
        .get('[data-cy=import-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => TestData.projectSample1())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .then(() => Toasts.assertText('Project loaded !'))
        // Check project name
        .get('[data-cy=project-name]')
        .should((elem) => {
          expect(elem.text()).equal('Test project made on 28/12/2020');
        })
        .then(() => TopBar.map())
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers).length(2);
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
        });
    });

    it('can export project with credentials', function () {
      cy.visit(Routes.map().format())
        .then(() => LayerControls.addWmsLayerWithCredentials())
        .then(() => Modules.open('project-management'))
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
        .then(() => Download.currentFileAsBlob())
        .should(async (downloaded) => {
          const project = await ProjectHelper.forBrowser().extractManifest(downloaded);
          expect(project.layers[2].type).equals(LayerType.Wms);
          const wmsMeta = project.layers[2].metadata as WmsMetadata;
          expect(wmsMeta.remoteUrls[0]).not.equal(WmsConstants.AUTHENTICATED_URL);
          expect(wmsMeta.remoteUrls[0]).contains('encrypted:');
          expect(wmsMeta.auth?.username).contains('encrypted:');
          expect(wmsMeta.auth?.username).not.equal(WmsConstants.USERNAME);
          expect(wmsMeta.auth?.username).contains('encrypted:');
          expect(wmsMeta.auth?.password).not.equal(WmsConstants.PASSWORD);
          expect(wmsMeta.auth?.password).contains('encrypted:');
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can import project with credentials', function () {
      cy.visit(Routes.map().format())
        .then(() => Modules.open('project-management'))
        .get('[data-cy=import-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => TestData.projectSample2())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .then(() => Toasts.assertText('Opening in progress ...'))
        // We must wait a little here otherwise password input will always be shown too late
        .wait(500)
        .get('[data-cy=password-input]')
        .should('be.empty')
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirm]')
        .click()
        .then(() => Toasts.assertText('Project loaded !'))
        // Check project name
        .get('[data-cy=project-name]')
        .should((elem) => {
          expect(elem.text()).equal('Test project with credentials made on 30/01/2021');
        })
        .then(() => TopBar.map())
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

      TestHelper.init()
        .then(() => Registration.newUser(email))
        .then(() => Registration.enableAccount(email));
    });

    afterEach(() => {
      return Authentication.logout();
    });

    it('can store project online without credentials', function () {
      cy.visit(Routes.map().format())
        .then(() => Modules.open('project-management'))
        .get('[data-cy=save-project]')
        .click()
        .then(() => Toasts.assertText('Project saved !'));
    });

    it('can store project online with credentials', function () {
      cy.visit(Routes.map().format())
        // Create a layer with credentials
        .then(() => LayerControls.addWmsLayerWithCredentials())
        // Save project online
        .then(() => Modules.open('project-management'))
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
        .then(() => Toasts.assertText('Project saved !'));
    });

    it('can load remote project', function () {
      cy.visit(Routes.map().format())
        // Add layers
        .then(() => LayerControls.addVectorLayer())
        .then(() => LayerControls.addVectorLayer())
        // Save project online
        .then(() => Modules.open('project-management'))
        .get('[data-cy=save-project]')
        .click()
        // Clean current projet and map
        .get('[data-cy=new-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        // Open remote project
        .get('[data-cy=remote-project]')
        .eq(0)
        .click()
        .get('[data-cy=open-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => Toasts.assertText('Project open !'))
        .then(() => TopBar.map())
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
          expect(layers[1].type).equal(LayerType.Vector);
          expect(layers[1].type).equal(LayerType.Vector);
        });
    });

    it('can load remote remote project with credentials', function () {
      cy.visit(Routes.map().format())
        // Add a layer
        .then(() => LayerControls.addWmsLayerWithCredentials())
        // Save project online
        .then(() => Modules.open('project-management'))
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
        .then(() => Toasts.assertText('Project saved !'))
        // Clean map
        .get('[data-cy=new-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        // Open remote project
        .get('[data-cy=remote-project]')
        .eq(0)
        .click()
        .get('[data-cy=open-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .get('[data-cy=password-input]')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=password-confirm]')
        .click()
        .then(() => Toasts.assertText('Project open !'))
        .then(() => TopBar.map())
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
          expect(layers[2].type).equal(LayerType.Wms);
        });
    });

    it('can delete project', function () {
      const projectName = `Project ${uuid()}`;
      cy.visit(Routes.map().format())
        .then(() => Modules.open('project-management'))
        // Rename project
        .get('[data-cy=edit-project-name]')
        .click()
        .get('[data-cy=prompt-input]')
        .clear()
        .type(projectName)
        .get('[data-cy=prompt-confirm]')
        .click()
        .get('[data-cy=project-name]')
        // Save project
        .get('[data-cy=save-project]')
        .click()
        .then(() => Toasts.assertText('Project saved !'))
        // Delete it
        .get('[data-cy=delete-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => Toasts.assertText('Project deleted !'))
        .get('[data-cy=remote-project]')
        .should('not.exist');
    });
  });
});
