import { FrontendRoutes } from '@abc-map/frontend-commons';
import { TestData } from '../../test-data/TestData';
import { MainMap } from '../../helpers/MainMap';
import { TestHelper } from '../../helpers/TestHelper';
import { History } from '../../helpers/History';

describe('Data import', () => {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can import data via graphical control, then undo', () => {
    cy.visit(FrontendRoutes.map())
      .get('[data-cy=import-data]')
      .click()
      .then(() => TestData.sampleGpx())
      .then((gpx) => {
        return cy.get('[data-cy=file-input]').attachFile({ filePath: 'sample.gpx', fileContent: gpx });
      })
      .wait(1_000)
      .then(() => MainMap.getReference())
      .should((map) => {
        const layerNames = map.getLayersMetadata().map((l) => l.name);
        expect(layerNames).length(3);
        expect(layerNames[2]).match(/Import/);

        const features = map.getActiveLayerFeatures();
        expect(features).length(12);
        features.forEach((f) => {
          expect(f.getId()).not.undefined;
          expect(f.getStyle()).not.null;
          expect(f.getStyle()).length(1);
        });
      })
      .then(() => History.undo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const layerNames = map.getLayersMetadata().map((l) => l.name);
        expect(layerNames).length(2);
      })
      .then(() => History.redo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const layerNames = map.getLayersMetadata().map((l) => l.name);
        expect(layerNames).length(3);
      });
  });

  it('User can import data via drag and drop, then undo', () => {
    cy.visit(FrontendRoutes.map())
      .then(() => TestData.sampleGpx())
      .then((gpx) => {
        return cy.window().then((win) => {
          const file = new win.File([gpx], 'sample.gpx');
          const dataTransfer = new win.DataTransfer();
          dataTransfer.items.add(file);
          return dataTransfer;
        });
      })
      .then((dataTransfer) => {
        return MainMap.getComponent().trigger('dragover').get('[data-cy=drag-overlay]').trigger('drop', { dataTransfer });
      })
      .wait(1_000)
      .then(() => MainMap.getReference())
      .should((map) => {
        const layerNames = map.getLayersMetadata().map((l) => l.name);
        expect(layerNames).length(3);
        expect(layerNames[2]).match(/Import/);

        const features = map.getActiveLayerFeatures();
        expect(features).length(12);
        features.forEach((f) => {
          expect(f.getId()).not.undefined;
          expect(f.getStyle()).not.null;
          expect(f.getStyle()).length(1);
        });
      })
      .then(() => History.undo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const layerNames = map.getLayersMetadata().map((l) => l.name);
        expect(layerNames).length(2);
      })
      .then(() => History.redo())
      .then(() => MainMap.getReference())
      .should((map) => {
        const layerNames = map.getLayersMetadata().map((l) => l.name);
        expect(layerNames).length(3);
      });
  });
});
