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
import { FrontendRoutes } from '@abc-map/shared';
import { LayerControls } from '../helpers/LayerControls';
import { TopBar } from '../helpers/TopBar';
import { MainMap } from '../helpers/MainMap';
import { LayoutPreview } from '../helpers/LayoutPreview';
import { Download } from '../helpers/Download';
import { LongOperation } from '../helpers/LongOperation';

describe('Projection', () => {
  beforeEach(() => {
    TestHelper.init();
  });

  it('can use projection and export project', function () {
    cy.visit(FrontendRoutes.map().raw())
      .then(() => MainMap.fixedView())
      // Delete geometry layer
      .then(() => LayerControls.deleteActiveLayer())
      // Change projection
      .get('[data-cy=edit-project]')
      .click()
      .get('[data-cy=projection-input]')
      .clear()
      .type('EPSG:2154')
      .get('[data-cy=button-confirm]')
      .click()
      .wait(600)
      .then(() => MainMap.getReference())
      .should((map) => {
        expect(map.getViewExtent()).deep.equal([-4433234.4736937545, 3222547.8542783004, 5375578.234959887, 10018369.379082989]);
      })
      .then(() => TopBar.layout())
      .get('[data-cy=layout-controls] [data-cy=new-layout]')
      .click()
      .then(() => LayoutPreview.getReference())
      .should((map) => {
        expect(map.getViewExtent()).deep.equal([-3105925.5821303385, 4085298.6337945205, 4048269.3433964713, 9155618.599566769]);
      })
      .get('[data-cy=layout-controls] [data-cy=pdf-export]')
      .click()
      .then(() => LongOperation.done(50_000))
      .then(() => Download.fileAsBlob())
      .should((pdf) => {
        expect(pdf.size).greaterThan(50_000);
      })
      .get('[data-cy=close-solicitation-modal]')
      .click();
  });
});
