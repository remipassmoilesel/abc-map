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
import { LayerControls } from '../helpers/LayerControls';
import { TopBar } from '../helpers/TopBar';
import { MainMap } from '../helpers/MainMap';
import { LayoutPreview } from '../helpers/LayoutPreview';
import { Download } from '../helpers/Download';
import { LongOperation } from '../helpers/LongOperation';
import { Routes } from '../helpers/Routes';

describe('Projection', () => {
  beforeEach(() => {
    TestHelper.init();
  });

  it('can use projection and export project', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .get('[data-cy=project-menu]')
      .click()
      .get('[data-cy=draw-menu]')
      .click()
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
      .wait(1000)
      .then(() => MainMap.getReference())
      .should((map) => {
        expect(map.getViewExtent()).deep.equal([-6092370.588148024, 3222547.8542783004, 7034714.349414157, 10018369.379082989]);
      })
      .then(() => TopBar.layout())
      .get('[data-cy=controls-menu]')
      .click()
      .get('[data-cy=add-layout]')
      .click()
      .then(() => LayoutPreview.getReference())
      .should((map) => {
        expect(map.getViewExtent()).deep.equal([-2747552.1814082167, 4334169.05096266, 3689895.9426743495, 8906748.182398628]);
      })
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
});
