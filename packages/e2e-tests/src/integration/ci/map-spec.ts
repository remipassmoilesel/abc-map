import { FrontendRoutes } from '@abc-map/shared-entities';
import { TestHelper } from '../../helpers/TestHelper';
import { LayerSelector } from '../../helpers/LayerSelector';

describe('Map', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('default map should have two layers with one active', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => LayerSelector.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Formes']);
      })
      .then(() => LayerSelector.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('Formes');
      });
  });

  it('user can add layer', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => LayerSelector.addLayer('Osm'))
      .then(() => LayerSelector.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Formes', 'OpenStreetMap']);
      })
      .then(() => LayerSelector.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('OpenStreetMap');
      });
  });

  it('user can add layer then undo and redo', function () {
    cy.visit(FrontendRoutes.map())
      .then(() => LayerSelector.addLayer('Osm'))
      .then(() => LayerSelector.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Formes', 'OpenStreetMap']);
      })
      // Undo
      .get('[data-cy=map-undo')
      .click()
      .then(() => LayerSelector.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Formes']);
      })
      .then(() => LayerSelector.getActiveItem())
      .should((elem) => {
        expect(elem.length).equals(1);
        expect(elem.text()).equals('Formes');
      })
      // Redo
      .get('[data-cy=map-redo')
      .click()
      .then(() => LayerSelector.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Formes', 'OpenStreetMap']);
      })
      .then(() => LayerSelector.getActiveItem())
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
      .get('[data-cy=modal-rename-confirm]')
      .click()
      .then(() => LayerSelector.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap', 'Awesome layer']);
      });
  });

  it('user can delete layer', function () {
    cy.visit(FrontendRoutes.map())
      .get('[data-cy=delete-layer]')
      .click()
      .then(() => LayerSelector.getNames())
      .should((names) => {
        expect(names).deep.equals(['OpenStreetMap']);
      });
  });
});
