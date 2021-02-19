import { AbcProject, FrontendRoutes, LayerType, WmsMetadata } from '@abc-map/shared-entities';
import { Toasts } from '../../helpers/Toasts';
import { TestHelper } from '../../helpers/TestHelper';
import { Download } from '../../helpers/Download';
import { Fixtures } from '../../helpers/Fixtures';
import { MainMap } from '../../helpers/MainMap';
import { LayerSelector } from '../../helpers/LayerSelector';
import { Env } from '../../helpers/Env';
import 'cypress-file-upload';

// TODO: better assertions on project and layers
// TODO: systematically add features

describe('Project', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  describe('As a Visitor', function () {
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

    it('cannot view recent projects', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=recent-projects] div')
        .should((elem) => {
          expect(elem.text()).equal("Vous n'êtes pas connecté");
        });
    });

    it('cannot save project online', function () {
      cy.visit(FrontendRoutes.map()).get('[data-cy=save-project]').click();
      Toasts.assertText('Vous devez être connecté pour enregistrer votre projet');
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
        .then(() => Download.textFile('[data-cy=export-project-output]'))
        .then((downloaded) => {
          return cy.fixture(Fixtures.projects.SAMPLE_1).then((witness) => ({ downloaded, witness }));
        })
        .should(({ downloaded, witness }) => {
          const projectA: AbcProject = JSON.parse(downloaded);
          const projectB: AbcProject = JSON.parse(witness);
          expect(projectA.metadata.projection).deep.equals(projectB.metadata.projection);
          expect(projectA.metadata.version).equals(projectB.metadata.version);
          expect(projectA.layers).length(projectB.layers.length);
          expect(projectA.layers[0].type).equals(projectB.layers[0].type);
          expect(projectA.layers[1].type).equals(projectB.layers[1].type);
          expect(projectA.layouts).deep.equals(projectB.layouts);
        });
    });

    it('can export project with credentials', function () {
      cy.visit(FrontendRoutes.map())
        .then(() => LayerSelector.addWmsLayerWithCredentials())
        .get('[data-cy=export-project]')
        .click()
        .then(() => Toasts.assertText('Export en cours ...'))
        .get('[data-cy=modal-password-input]')
        .should('be.empty')
        .clear()
        .type(Env.projectPassword())
        .get('[data-cy=modal-password-confirm]')
        .click()
        .then(() => Download.textFile('[data-cy=export-project-output]'))
        .should((downloaded) => {
          const projectA: AbcProject = JSON.parse(downloaded);
          expect(projectA.layers[2].type).equals(LayerType.Wms);
          expect((projectA.layers[2].metadata as WmsMetadata).remoteUrl).not.equal(Env.wmsUrl());
          expect((projectA.layers[2].metadata as WmsMetadata).remoteUrl).contains('encrypted:');
          expect((projectA.layers[2].metadata as WmsMetadata).auth?.username).contains('encrypted:');
          expect((projectA.layers[2].metadata as WmsMetadata).auth?.username).not.equal(Env.wmsUsername());
          expect((projectA.layers[2].metadata as WmsMetadata).auth?.username).contains('encrypted:');
          expect((projectA.layers[2].metadata as WmsMetadata).auth?.password).not.equal(Env.wmsPassword());
          expect((projectA.layers[2].metadata as WmsMetadata).auth?.password).contains('encrypted:');
        });
    });

    it('can import project', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=import-project]')
        .click()
        .get('[data-cy=import-project-input]')
        .attachFile(Fixtures.projects.SAMPLE_1)
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

    it('can import project with credentials', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=import-project]')
        .click()
        .get('[data-cy=import-project-input]')
        .attachFile(Fixtures.projects.SAMPLE_2)
        .then(() => Toasts.assertText('Chargement ...'))
        .get('[data-cy=modal-password-input]')
        .should('be.empty')
        .type(Env.projectPassword())
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

    it('password modal do not keep password in state', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=import-project]')
        .click()
        .get('[data-cy=import-project-input]')
        .attachFile(Fixtures.projects.SAMPLE_2)
        .then(() => Toasts.assertText('Chargement ...'))
        .get('[data-cy=modal-password-input]')
        .should('be.empty')
        .type(Env.projectPassword())
        .get('[data-cy=modal-password-cancel]')
        .click()
        .get('[data-cy=import-project]')
        .click()
        .get('[data-cy=import-project-input]')
        .attachFile(Fixtures.projects.SAMPLE_2)
        .then(() => Toasts.assertText('Chargement ...'))
        .get('[data-cy=modal-password-input]')
        .should('be.empty');
    });
  });
});
