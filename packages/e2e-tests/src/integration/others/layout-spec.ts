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

import { FrontendRoutes } from '@abc-map/shared';
import { TestHelper } from '../../helpers/TestHelper';
import { LayoutPreview } from '../../helpers/LayoutPreview';
import { LayoutList } from '../../helpers/LayoutList';
import { History } from '../../helpers/History';
import { Download } from '../../helpers/Download';
import { Toasts } from '../../helpers/Toasts';
import { MainMap } from '../../helpers/MainMap';
import { TopBar } from '../../helpers/TopBar';

describe('Layout', function () {
  describe('As a visitor', function () {
    beforeEach(() => {
      TestHelper.init();
    });

    it('on first view, see no layout and can create one with center button', function () {
      cy.visit(FrontendRoutes.map().raw())
        .then(() => MainMap.fixedView())
        .then(() => TopBar.layout())
        .get('[data-cy=layout-list] [data-cy=no-layout]')
        .should('exist')
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem.length).equal(0))
        .get('[data-cy=layout-preview] [data-cy=new-layout]')
        .click()
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 1']))
        .then(() => LayoutPreview.getComponent())
        .should('exist')
        .then(() => LayoutPreview.getReference())
        .should((map) => {
          const view = map.getViewExtent();
          expect(view).deep.equal([-2297924.619781941, -8101663.15454807, 10626848.92093467, 10073140.74773206]);
        });
    });

    it('can create layout, undo and redo', function () {
      cy.visit(FrontendRoutes.layout().raw())
        .get('[data-cy=layout-controls] [data-cy=new-layout]')
        .click()
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 1']))
        .get('[data-cy=layout-controls] [data-cy=new-layout]')
        .click()
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']))
        .then(() => History.undo())
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 1']))
        .then(() => History.redo())
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']));
    });

    it('can change layout order, undo and redo', function () {
      cy.visit(FrontendRoutes.layout().raw())
        .get('[data-cy=layout-controls] [data-cy=new-layout]')
        .click()
        .click()
        .get('[data-cy=layout-controls] [data-cy=layout-up]')
        .click()
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 2', 'Page 1']))
        .get('[data-cy=layout-controls] [data-cy=layout-down]')
        .click()
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']))
        .then(() => History.undo())
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 2', 'Page 1']))
        .then(() => History.redo())
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']));
    });

    it('can delete all layouts, undo and redo', function () {
      cy.visit(FrontendRoutes.layout().raw())
        .get('[data-cy=layout-controls] [data-cy=new-layout]')
        .click()
        .click()
        .get('[data-cy=layout-controls] [data-cy=clear-all]')
        .click()
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal([]))
        .then(() => History.undo())
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal(['Page 1', 'Page 2']))
        .then(() => History.redo())
        .then(() => LayoutList.getNames())
        .should((elem) => expect(elem).deep.equal([]));
    });

    it('can export as PDF', function () {
      cy.visit(FrontendRoutes.layout().raw())
        .get('[data-cy=layout-controls] [data-cy=new-layout]')
        .click()
        .click()
        .get('[data-cy=layout-controls] [data-cy=pdf-export]')
        .click()
        .get('[data-cy=close-solicitation-modal]')
        .click()
        .then(() => Toasts.assertText('Export terminé !'))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(400_000);
        });
    });

    it('can export as PNG', function () {
      cy.visit(FrontendRoutes.layout().raw())
        .get('[data-cy=layout-controls] [data-cy=new-layout]')
        .click()
        .click()
        .get('[data-cy=layout-controls] [data-cy=png-export]')
        .click()
        .get('[data-cy=close-solicitation-modal]')
        .click()
        .then(() => Toasts.assertText('Export terminé !'))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(400_000);
        });
    });
  });
});
