/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { TestHelper } from '../helpers/TestHelper';
import { Download } from '../helpers/Download';
import { LayerControls } from '../helpers/LayerControls';
import { LongOperation } from '../helpers/LongOperation';
import { Routes } from '../helpers/Routes';
import { Modules } from '../helpers/Modules';
import { MainMap } from '../helpers/MainMap';
import { TestData } from '../test-data/TestData';
import { Toasts } from '../helpers/Toasts';
import { PngComparisonParams, PngComparisonResult } from '../plugins/PngComparison';
import * as uuid from 'uuid-random';
import { MainMenu } from '../helpers/MainMenu';
import { FilePrompt } from '../helpers/FilePrompt';
import Chainable = Cypress.Chainable;

// Most of the time exports take about 5 seconds but sometimes if take much longer, probably
// because of testing environment. So we set a long timeout in order to prevent anoying failures.
const exportTimeoutMs = 3 * 60 * 1000;

describe('Static exports', function () {
  describe('As a visitor', function () {
    beforeEach(() => {
      TestHelper.init();
    });

    it('can create layout, undo and redo', function () {
      cy.visit(Routes.module().withParams({ moduleId: 'static-export' }))
        .get('[data-cy=new-layout]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 1']))
        .get('[data-cy=add-layout]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']))
        .get('[data-cy=undo]')
        .click()
        .wait(800)
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 1']))
        .get('[data-cy=redo]')
        .click()
        .wait(800)
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']));
    });

    it('can change layout order, undo and redo', function () {
      cy.visit(Routes.module().withParams({ moduleId: 'static-export' }))
        .get('[data-cy=add-layout]')
        .click()
        .click()
        .get('[data-cy=layout-up]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 2', 'Page 1']))
        .get('[data-cy=layout-down]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']))
        .get('[data-cy=undo]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 2', 'Page 1']))
        .get('[data-cy=redo]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']));
    });

    it('can delete all layouts, undo and redo', function () {
      cy.visit(Routes.module().withParams({ moduleId: 'static-export' }))
        // Add two layouts
        .get('[data-cy=add-layout]')
        .click()
        .wait(300)
        .click()
        .wait(300)
        .get('[data-cy=clear-all]')
        .click()
        .wait(300)
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal([]))
        .get('[data-cy=undo]')
        .click()
        .wait(300)
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']))
        .get('[data-cy=redo]')
        .click()
        .wait(300)
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal([]));
    });

    it('can export PDF with predefined layer', function () {
      cy.visit(Routes.map().format())
        .then(() => MainMap.fixedView2())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => Modules.open('static-export'))
        .get('[data-cy=add-layout]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(exportTimeoutMs))
        .then(() => Download.currentFileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(50_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can export PDF with XYZ layer', function () {
      cy.visit(Routes.map().format())
        .then(() => MainMap.fixedView2())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.addXyzLayer())
        .then(() => Modules.open('static-export'))
        .get('[data-cy=add-layout]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(exportTimeoutMs))
        .then(() => Download.currentFileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(50_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can export PDF with WMS layer', function () {
      cy.visit(Routes.map().format())
        .then(() => MainMap.fixedView2())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.addWmsLayer())
        .then(() => Modules.open('static-export'))
        .get('[data-cy=add-layout]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(exportTimeoutMs))
        .then(() => Download.currentFileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(50_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can export PDF with WMTS layer', function () {
      cy.visit(Routes.map().format())
        .then(() => MainMap.fixedView2())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.addWmtsLayer())
        .then(() => Modules.open('static-export'))
        .get('[data-cy=add-layout]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(exportTimeoutMs))
        .then(() => Download.currentFileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(50_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can export PNG with several sheets', function () {
      cy.visit(Routes.map().format())
        .then(() => MainMap.fixedView2())
        .then(() => Modules.open('static-export'))
        .get('[data-cy=add-layout]')
        .click()
        .click()
        .get('[data-cy=png-export]')
        .click()
        .then(() => LongOperation.done(exportTimeoutMs))
        .then(() => Download.currentFileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(100_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can create a text frame then export', () => {
      cy.visit(Routes.map().format())
        .then(() => MainMap.fixedView2())
        .then(() => Modules.open('static-export'))
        // Create layout
        .get('[data-cy=add-layout]')
        .click()
        .wait(800)
        // Create text frame
        .get('[data-cy=create-text-frame]')
        .click()
        .get('[data-cy=floating-text-frame]')
        // FIXME: We should edit frame but selection and typing does not work anymore in tests
        .should('exist')
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(exportTimeoutMs))
        .then(() => Download.currentFileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(100_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    /**
     * For the moment, this test only pass in continuous integration.
     *
     * If you know how to make it pass on all platforms, ping me !
     */
    it('rendering should be conform', function () {
      const testId = uuid();
      const comparisonParams: PngComparisonParams = {
        actualZipPath: `generated/png-comparison-${testId}.zip`,
        expectedZipPath: `src/test-data/test-project-3.png.zip`,
        testId,
      };

      cy.visit(Routes.map().format())
        .then(() => MainMenu.open())
        .get('[data-cy=main-menu] [data-cy=import-project]')
        .click()
        .get('[data-cy=confirmation-confirm]')
        .click()
        .then(() => TestData.projectSample3())
        .then((file) => FilePrompt.select('project.abm2', file))
        .then(() => Toasts.assertText('Project loaded !'))
        .then(() => MainMenu.close())
        .then(() => Modules.open('static-export'))
        .get('[data-cy=png-export]')
        .click()
        .then(() => LongOperation.done(exportTimeoutMs))
        .then(() => Download.writeCurrentFile(comparisonParams.actualZipPath))
        .then(() => cy.task<PngComparisonResult>('rendering-comparison', comparisonParams))
        .should((comparison) => expect(comparison.value).equal(0, `Rendering comparison failed. Message="${comparison.message}" Diff="${comparison.diff}".`));
    });
  });
});

function getLayoutNames(): Chainable<string[]> {
  return cy.get('[data-cy=layout-list]').then(
    (elem) =>
      elem
        .find('[data-cy=list-item]')
        .toArray()
        .map((elem) => elem.textContent)
        .filter((s) => !!s) as string[]
  );
}
