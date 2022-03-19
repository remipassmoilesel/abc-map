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
import { TopBar } from '../helpers/TopBar';
import { LongOperation } from '../helpers/LongOperation';
import { Routes } from '../helpers/Routes';
import Chainable = Cypress.Chainable;

describe('Layout', function () {
  describe('As a visitor', function () {
    beforeEach(() => {
      TestHelper.init();
    });

    it('can create layout, undo and redo', function () {
      cy.visit(Routes.export().format())
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
      cy.visit(Routes.export().format())
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
      cy.visit(Routes.export().format())
        // Add two layouts
        .get('[data-cy=add-layout]')
        .click()
        .click()
        .get('[data-cy=clear-all]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal([]))
        .get('[data-cy=undo]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']))
        .get('[data-cy=redo]')
        .click()
        .then(() => getLayoutNames())
        .should((elem) => expect(elem).deep.equal([]));
    });

    it('can export PDF with predefined layer', function () {
      cy.visit(Routes.map().format())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => TopBar.export())
        .click()
        .get('[data-cy=add-layout]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(50_000))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(50_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can export PDF with XYZ layer', function () {
      cy.visit(Routes.map().format())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.addXyzLayer())
        .then(() => TopBar.export())
        .click()
        .get('[data-cy=add-layout]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(50_000))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(50_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can export PDF with WMS layer', function () {
      cy.visit(Routes.map().format())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.addWmsLayer())
        .then(() => TopBar.export())
        .get('[data-cy=add-layout]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(50_000))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(50_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can export PDF with WMTS layer', function () {
      cy.visit(Routes.map().format())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.deleteActiveLayer())
        .then(() => LayerControls.addWmtsLayer())
        .then(() => TopBar.export())
        .get('[data-cy=add-layout]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(50_000))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(50_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can export PNG with several sheets', function () {
      cy.visit(Routes.export().format())
        .get('[data-cy=add-layout]')
        .click()
        .click()
        .get('[data-cy=png-export]')
        .click()
        .then(() => LongOperation.done(50_000))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(100_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
    });

    it('can create a text frame then export', () => {
      cy.visit(Routes.export().format())
        // Create layout
        .get('[data-cy=add-layout]')
        .click()
        // Create text frame
        .get('[data-cy=create-text-frame]')
        .click()
        .get('[data-cy=floating-text-frame]')
        .should('exist')
        .get('[data-cy=toggle-full-screen-editor]')
        .click()
        .get('[data-cy=full-screen-editor]')
        .type('{selectAll}')
        .type('{del}')
        .type('Hello World')
        .type('{selectAll}')
        .get('[data-cy=bold]')
        .click()
        .get('[data-cy=italic]')
        .click()
        .get('[data-cy=underline]')
        .click()
        .get('[data-cy=close-full-screen-editor]')
        .click()
        .get('[data-cy=pdf-export]')
        .click()
        .then(() => LongOperation.done(50_000))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(100_000);
        })
        .get('[data-cy=close-solicitation-modal]')
        .click();
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
