import { LayerType, WmsMetadata } from '@abc-map/shared-entities';
import { FrontendRoutes, ProjectHelper } from '@abc-map/frontend-shared';
import { Toasts } from '../../helpers/Toasts';
import { TestHelper } from '../../helpers/TestHelper';
import { Download } from '../../helpers/Download';
import { TestData } from '../../test-data/TestData';
import { MainMap } from '../../helpers/MainMap';
import { LayerSelector } from '../../helpers/LayerSelector';
import { WmsConstants } from '../../helpers/WmsConstants';
import { Registration } from '../../helpers/Registration';
import { Login } from '../../helpers/Login';
import * as uuid from 'uuid-random';
import 'cypress-file-upload';

const PROJECT_PASSWORD = 'azerty1234';

// TODO: better assertions on project and layers
// TODO: test features and style

describe('Project', function () {
  describe('As a visitor', function () {
    beforeEach(() => {
      TestHelper.init();
    });

    it('can create new project', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=new-project]')
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
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=rename-project]')
        .click()
        .get('[data-cy=modal-rename-input]')
        .clear()
        .type('My awesome project')
        .get('[data-cy=modal-rename-confirm]')
        .click()
        .get('[data-cy=project-name]')
        .should((elem) => {
          expect(elem.text()).equal('My awesome project');
        });
    });

    it('can export project', function () {
      cy.visit(FrontendRoutes.map())
        .then(() => LayerSelector.addWmsLayer())
        .get('[data-cy=export-project]')
        .click()
        .then(() => Toasts.assertText('Export en cours ...'))
        .then(() => Toasts.assertText('Export terminé !'))
        .then(() => Download.fileAsBlob())
        .then((downloaded) => TestData.projectSample1().then((witness) => ({ downloaded, witness })))
        .should(async ({ downloaded, witness }) => {
          const projectA = await ProjectHelper.extractManifest(downloaded);
          const projectB = await ProjectHelper.extractManifest(witness);
          expect(projectA.metadata.projection).deep.equals(projectB.metadata.projection);
          expect(projectA.metadata.version).equals(projectB.metadata.version);
          expect(projectA.layers).length(projectB.layers.length);
          expect(projectA.layers[0].type).equals(projectB.layers[0].type);
          expect(projectA.layers[1].type).equals(projectB.layers[1].type);
          expect(projectA.layers[2].type).equals(projectB.layers[2].type);
          expect(projectA.layouts).deep.equals(projectB.layouts);
        });
    });

    it('can import project', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=import-project]')
        .click()
        .then(() => TestData.projectSample1())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .then(() => Toasts.assertText('Chargement ...'))
        .then(() => Toasts.assertText('Projet importé !'))
        // Check project name
        .get('[data-cy=project-name]')
        .should((elem) => {
          expect(elem.text()).equal('Test project made on 28/12/2020');
        })
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers).length(3);
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
          expect(layers[2].type).equal(LayerType.Wms);
        });
    });

    it('can export project with credentials', function () {
      cy.visit(FrontendRoutes.map())
        .then(() => LayerSelector.addWmsLayerWithCredentials())
        .get('[data-cy=export-project]')
        .click()
        .get('[data-cy=modal-password-input]')
        .should('be.empty')
        .clear()
        .type(PROJECT_PASSWORD)
        .get('[data-cy=modal-password-confirm]')
        .click()
        .then(() => Download.fileAsBlob())
        .should(async (downloaded) => {
          const project = await ProjectHelper.extractManifest(downloaded);

          expect(project.layers[2].type).equals(LayerType.Wms);
          expect((project.layers[2].metadata as WmsMetadata).remoteUrl).not.equal(WmsConstants.AUTHENTICATED_URL);
          expect((project.layers[2].metadata as WmsMetadata).remoteUrl).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).not.equal(WmsConstants.USERNAME);
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.password).not.equal(WmsConstants.PASSWORD);
          expect((project.layers[2].metadata as WmsMetadata).auth?.password).contains('encrypted:');
        });
    });

    it('can import project with credentials', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=import-project]')
        .click()
        .then(() => TestData.projectSample2())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .get('[data-cy=modal-password-input]')
        .should('be.empty')
        .type(PROJECT_PASSWORD)
        .get('[data-cy=modal-password-confirm]')
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

    // TODO: replace by unit test
    it('password modal do not keep password in state', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=import-project]')
        .click()
        .then(() => TestData.projectSample2())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .get('[data-cy=modal-password-input]')
        .should('be.empty')
        .type(PROJECT_PASSWORD)
        .get('[data-cy=modal-password-cancel]')
        .click()
        .get('[data-cy=import-project]')
        .click()
        .then(() => TestData.projectSample2())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .get('[data-cy=modal-password-input]')
        .should('be.empty');
    });
  });

  describe('As a user', function () {
    beforeEach(() => {
      TestHelper.init()
        .then(() => Registration.newUser())
        .then((user) => Login.login(user));
    });

    it('can store project online without credentials', function () {
      cy.visit(FrontendRoutes.map())
        .then(() => LayerSelector.addWmsLayer())
        .get('[data-cy=save-project]')
        .click()
        .then(() => Toasts.assertText('Enregistrement en cours ...'))
        .then(() => Toasts.assertText('Projet enregistré !'));
    });

    it('can store project online with credentials', function () {
      cy.visit(FrontendRoutes.map())
        // Create a project and store it online
        .then(() => LayerSelector.addWmsLayerWithCredentials())
        .get('[data-cy=save-project]')
        .click()
        .get('[data-cy=modal-password-input]')
        .clear()
        .type('azerty1234')
        .get('[data-cy=modal-password-confirm]')
        .click()
        .then(() => Toasts.assertText('Projet enregistré !'));
    });

    it('can load remote project', function () {
      cy.visit(FrontendRoutes.map())
        // Create a project and store it online
        .then(() => LayerSelector.addWmsLayer())
        .get('[data-cy=save-project]')
        .click()
        .then(() => Toasts.assertText('Projet enregistré !'))
        // Clean map
        .get('[data-cy=new-project]')
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
          expect(layers[2].type).equal(LayerType.Wms);
        });
    });

    it('can load remote remote project with credentials', function () {
      cy.visit(FrontendRoutes.map())
        // Create a project and store it online
        .then(() => LayerSelector.addWmsLayerWithCredentials())
        .get('[data-cy=save-project]')
        .click()
        .get('[data-cy=modal-password-input]')
        .clear()
        .type('azerty1234')
        .get('[data-cy=modal-password-confirm]')
        .click()
        .then(() => Toasts.assertText('Projet enregistré !'))
        // Clean map
        .get('[data-cy=new-project]')
        .click()
        // Open remote project
        .get('[data-cy=remote-projects]')
        .click()
        .get('[data-cy=remote-project]')
        .eq(0)
        .click()
        .get('[data-cy=project-password]')
        .clear()
        .type('azerty1234')
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

    it('delete project', function () {
      const projectName = uuid();
      cy.visit(FrontendRoutes.map())
        // Create project
        .then(() => LayerSelector.addWmsLayer())
        // Rename project
        .get('[data-cy=rename-project]')
        .click()
        .get('[data-cy=modal-rename-input]')
        .clear()
        .type(projectName)
        .get('[data-cy=modal-rename-confirm]')
        .click()
        .get('[data-cy=project-name]')
        // Save project
        .get('[data-cy=save-project]')
        .click()
        .then(() => Toasts.assertText('Enregistrement en cours ...'))
        .then(() => Toasts.assertText('Projet enregistré !'))
        // Delete it
        .get('[data-cy=remote-projects]')
        .click()
        .get('[data-cy=delete-project]')
        .click()
        .get('[data-cy=confirm-deletion]')
        .click()
        .then(() => Toasts.assertText('Project supprimé !'))
        .get('[data-cy=remote-project]')
        .should('not.exist');
    });
  });
});
