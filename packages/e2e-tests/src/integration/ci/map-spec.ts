import { FrontendRoutes } from '@abc-map/frontend-commons';
import { TestHelper } from '../../helpers/TestHelper';
import { LayerControls } from '../../helpers/LayerControls';
import { History } from '../../helpers/History';

describe('Map', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('default map should have two layers with one active', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('Géométries');
      });
  });

  it('user can add layer', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => LayerControls.addOsmLayer())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries', 'OpenStreetMap']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('OpenStreetMap');
      });
  });

  it('user can add layer then undo and redo', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => LayerControls.addOsmLayer())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries', 'OpenStreetMap']);
      })
      // Undo
      .then(() => History.undo())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('Géométries');
      })
      // Redo
      .then(() => History.redo())
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Géométries', 'OpenStreetMap']);
      })
      .then(() => LayerControls.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('OpenStreetMap');
      });
  });

  it('user can rename layer', function () {
    cy.visit(FrontendRoutes.map())
      .get('[data-cy=rename-layer]')
      .click()
      .get('[data-cy=modal-rename-input]')
      .clear()
      .type('Awesome layer')
      .get('[data-cy=rename-modal-confirm]')
      .click()
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Awesome layer']);
      });
  });

  it('user can delete layer', function () {
    cy.visit(FrontendRoutes.map())
      .get('[data-cy=delete-layer]')
      .click()
      .then(() => LayerControls.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap']);
      });
  });
});
