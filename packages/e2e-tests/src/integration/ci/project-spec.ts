import { AbcProject, FrontendRoutes } from '@abc-map/shared-entities';
import { Toasts } from '../../helpers/Toasts';
import { TestHelper } from '../../helpers/TestHelper';
import { Download } from '../../helpers/Download';
import { Fixtures } from '../../helpers/Fixtures';
import 'cypress-file-upload';

// TODO: same test as connected user
describe('Project', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  describe('Visitor', function () {
    it('can create new project', function () {
      cy.visit(FrontendRoutes.map()).get('[data-cy=new-project]').click();
      Toasts.assertText('Nouveau projet créé');
    });

    it('cannot view recent projects', function () {
      cy.visit(FrontendRoutes.map())
        .get('[data-cy=recent-projects] div')
        .should((elem) => {
          expect(elem.text()).equal("Vous n'êtes pas connecté");
        });
    });

    it('cannot save project', function () {
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

    // TODO: make the same test with layers and features
    it('can export empty project', function () {
      cy.visit(FrontendRoutes.map()).get('[data-cy=export-project]').click();
      Toasts.assertText('Export en cours ...');
      Toasts.assertText('Export terminé !');
      Download.textFile('[data-cy=export-project-output]')
        .then((downloaded) => {
          return cy.fixture(Fixtures.projects.TEST_1).then((witness) => ({ downloaded, witness }));
        })
        .should(({ downloaded, witness }) => {
          const projectA: AbcProject = JSON.parse(downloaded);
          const projectB: AbcProject = JSON.parse(witness);
          expect(projectA.metadata.projection).deep.equals(projectB.metadata.projection);
          expect(projectA.metadata.version).equals(projectB.metadata.version);
          expect(projectA.layers[0].type).equals(projectB.layers[0].type);
          expect(projectA.layers[1].type).equals(projectB.layers[1].type);
          expect(projectA.layouts).deep.equals(projectB.layouts);
        });
    });

    // TODO: better assertions on project
    it('can import project', function () {
      cy.visit(FrontendRoutes.map()).get('[data-cy=import-project]').click().get('[data-cy=import-project-input]').attachFile(Fixtures.projects.TEST_1);
      Toasts.assertText('Chargement ...');
      Toasts.assertText('Projet importé !');
      cy.get('[data-cy=project-name]').should((elem) => {
        expect(elem.text()).equal('Projet de test du 28/12/2020');
      });
    });
  });
});
