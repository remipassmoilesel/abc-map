import { LayerType, WmsMetadata } from '@abc-map/shared-entities';
import { FrontendRoutes, ProjectHelper } from '@abc-map/frontend-shared';
import { Toasts } from '../../../helpers/Toasts';
import { TestHelper } from '../../../helpers/TestHelper';
import { Download } from '../../../helpers/Download';
import { TestData } from '../../../test-data/TestData';
import { MainMap } from '../../../helpers/MainMap';
import { LayerSelector } from '../../../helpers/LayerSelector';
import { Env } from '../../../helpers/Env';
import 'cypress-file-upload';

describe('Project credentials', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  describe('As a Visitor', function () {
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
        .then(() => Download.file('[data-cy=file-output]'))
        .should(async (downloaded) => {
          const project = await ProjectHelper.extractManifest(downloaded);

          expect(project.layers[2].type).equals(LayerType.Wms);
          expect((project.layers[2].metadata as WmsMetadata).remoteUrl).not.equal(Env.wmsUrl());
          expect((project.layers[2].metadata as WmsMetadata).remoteUrl).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).not.equal(Env.wmsUsername());
          expect((project.layers[2].metadata as WmsMetadata).auth?.username).contains('encrypted:');
          expect((project.layers[2].metadata as WmsMetadata).auth?.password).not.equal(Env.wmsPassword());
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

    // TODO: replace by unit test
    it('password modal do not keep password in state', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=import-project]')
        .click()
        .then(() => TestData.projectSample2())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .then(() => Toasts.assertText('Chargement ...'))
        .get('[data-cy=modal-password-input]')
        .should('be.empty')
        .type(Env.projectPassword())
        .get('[data-cy=modal-password-cancel]')
        .click()
        .get('[data-cy=import-project]')
        .click()
        .then(() => TestData.projectSample2())
        .then((project) => {
          return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
        })
        .then(() => Toasts.assertText('Chargement ...'))
        .get('[data-cy=modal-password-input]')
        .should('be.empty');
    });
  });
});
