import { FrontendRoutes } from '@abc-map/frontend-shared';
import { TestHelper } from '../../helpers/TestHelper';
import { LayoutPreview } from '../../helpers/LayoutPreview';
import { LayoutList } from '../../helpers/LayoutList';
import { History } from '../../helpers/History';
import { Download } from '../../helpers/Download';
import { Toasts } from '../../helpers/Toasts';

describe('Layout', function () {
  describe('As a visitor', function () {
    beforeEach(() => {
      TestHelper.init();
    });

    it('on first view, see no layout and can create one with center button', function () {
      cy.visit(FrontendRoutes.layout())
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
      cy.visit(FrontendRoutes.layout())
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
      cy.visit(FrontendRoutes.layout())
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
      cy.visit(FrontendRoutes.layout())
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
      cy.visit(FrontendRoutes.layout())
        .get('[data-cy=layout-controls] [data-cy=new-layout]')
        .click()
        .click()
        .get('[data-cy=layout-controls] [data-cy=pdf-export]')
        .click()
        .then(() => Toasts.assertText('Export terminé !'))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(400_000);
        });
    });

    it('can export as PNG', function () {
      cy.visit(FrontendRoutes.layout())
        .get('[data-cy=layout-controls] [data-cy=new-layout]')
        .click()
        .click()
        .get('[data-cy=layout-controls] [data-cy=png-export]')
        .click()
        .then(() => Toasts.assertText('Export terminé !'))
        .then(() => Download.fileAsBlob())
        .should((pdf) => {
          expect(pdf.size).greaterThan(400_000);
        });
    });
  });
});
