import { TestHelper } from '../../../helpers/TestHelper';
import { FrontendRoutes } from '@abc-map/frontend-commons';
import { DataStore } from '../../../helpers/DataStore';
import { TopBar } from '../../../helpers/TopBar';

describe('Script module', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can execute sample script', () => {
    cy.visit(FrontendRoutes.dataProcessing())
      .get('[data-cy=scripts]')
      .click()
      .get('[data-cy=execute]')
      .click()
      .get('[data-cy=message]')
      .should('contain', 'Script exécuté sans erreurs')
      .get('[data-cy=output]')
      .should('contain', 'OpenStreetMap\nGéométries');
  });

  it('User can update features', () => {
    const script = `\
const layerName = map.listLayers()[2].name;
map.getFeaturesOfLayer(layerName).forEach((f, i) => f.set('e2e', i))
map.getFeaturesOfLayer(layerName).forEach((f) => log(f.get('e2e')))
`;
    cy.visit(FrontendRoutes.dataProcessing())
      .then(() => DataStore.importByName('Pays du monde'))
      .then(() => TopBar.dataProcessing())
      .get('[data-cy=scripts]')
      .click()
      .get('#code-editor')
      .clear()
      .type(script)
      .get('[data-cy=execute]')
      .click()
      .get('[data-cy=message]')
      .should('contain', 'Script exécuté sans erreurs')
      .get('[data-cy=output]')
      .should('contain', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
  });
});
