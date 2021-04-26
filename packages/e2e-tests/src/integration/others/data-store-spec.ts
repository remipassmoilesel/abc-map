import { FrontendRoutes } from '@abc-map/frontend-commons';
import { TestHelper } from '../../helpers/TestHelper';
import { Download } from '../../helpers/Download';
import { Toasts } from '../../helpers/Toasts';
import { MainMap } from '../../helpers/MainMap';

describe('Data store', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can search then download artefact', () => {
    cy.visit(FrontendRoutes.dataStore())
      .get('[data-cy=data-store-search]')
      .type('pays')
      .type('{enter}')
      .get('[data-cy=artefact-name]')
      .should('contain', 'Pays du monde')
      .get('[data-cy=download-artefact]')
      .click()
      .then(() => Download.fileAsBlob())
      .should(async (file) => {
        expect(file).not.undefined;
        expect(file.size).equal(1_577_455);
      });
  });

  it('User can search then add artefact to project', () => {
    cy.visit(FrontendRoutes.dataStore())
      .get('[data-cy=data-store-search]')
      .type('pays')
      .type('{enter}')
      .get('[data-cy=artefact-name]')
      .should('contain', 'Pays du monde')
      .get('[data-cy=import-artefact]')
      .click()
      .then(() => Toasts.assertText('Import terminé !'))
      .then(() => MainMap.getReference())
      .should((map) => {
        const layers = map.getLayersMetadata();
        expect(layers).length(3);
        expect(layers[2].name).match(/^Import de/);

        const features = map.getActiveLayerFeatures();
        expect(features).length(252);
      });
  });

  it('User can search then show license', () => {
    cy.visit(FrontendRoutes.dataStore())
      .get('[data-cy=data-store-search]')
      .type('pays')
      .type('{enter}')
      .get('[data-cy=artefact-name]')
      .should('contain', 'Pays du monde')
      .get('[data-cy=show-license]')
      .click()
      .get('[data-cy=license-header]')
      .should('contain', "Pays du monde : License d'utilisation");
  });
});
