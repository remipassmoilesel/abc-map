import { TestHelper } from '../../../helpers/TestHelper';
import { FrontendRoutes } from '@abc-map/frontend-commons';
import { DataStore } from '../../../helpers/DataStore';
import { TopBar } from '../../../helpers/TopBar';
import { Download } from '../../../helpers/Download';

describe('Data viewer module', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can see layer data', () => {
    cy.visit(FrontendRoutes.dataProcessing())
      .then(() => DataStore.importByName('Pays du monde'))
      .then(() => TopBar.dataProcessing())
      .get('[data-cy=data-viewer]')
      .click()
      .get('[data-cy=layer-selector] > option')
      .eq(2)
      .then((opt) => cy.get('[data-cy=layer-selector]').select(opt.text()))
      .get('[data-cy=data-table] [data-cy=header]')
      .should((elems) => {
        expect(elems.toArray().map((e) => e.textContent)).deep.equal(['COUNTRY']);
      })
      .get('[data-cy=data-table] [data-cy=cell]')
      .should((elems) => {
        expect(elems).length(252);

        const cells = elems
          .toArray()
          .slice(0, 5)
          .map((e) => e.textContent);
        expect(cells).deep.equal(['South Korea', 'Turkmenistan', 'Tajikistan', 'North Korea', 'Uzbekistan']);
      });
  });

  it('User can download', () => {
    cy.visit(FrontendRoutes.dataProcessing())
      .then(() => DataStore.importByName('Pays du monde'))
      .then(() => TopBar.dataProcessing())
      .get('[data-cy=data-viewer]')
      .click()
      .get('[data-cy=layer-selector] > option')
      .eq(2)
      .then((opt) => cy.get('[data-cy=layer-selector]').select(opt.text()))
      .get('[data-cy=download]')
      .click()
      .then(() => Download.fileAsBlob())
      .should(async (file) => {
        expect(file).not.undefined;
        expect(file.size).equal(3_422);
      });
  });
});
