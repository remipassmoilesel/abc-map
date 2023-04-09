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
import { MainMap } from '../helpers/MainMap';
import { LayoutPreviewMap } from '../helpers/LayoutPreviewMap';
import { Download } from '../helpers/Download';
import { LongOperation } from '../helpers/LongOperation';
import { Routes } from '../helpers/Routes';
import { Modules } from '../helpers/Modules';
import { TopBar } from '../helpers/TopBar';

describe('Projection', () => {
  beforeEach(() => {
    TestHelper.init();
  });

  it('can use projection and export project', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView1())
      // Delete geometry layer
      .then(() => LayerControls.deleteActiveLayer())
      // Change projection
      .then(() => Modules.open('project-management'))
      .get('[data-cy=edit-projection]')
      .click()
      .get('[data-cy=prompt-input]')
      .clear()
      .type('EPSG:2154')
      .get('[data-cy=prompt-confirm]')
      .click()
      .then(() => TopBar.map())
      .wait(1000)
      .then(() => MainMap.getReference())
      .should((map) => {
        const extent = map.getViewExtent();
        expect(extent).deep.equal([139344.6577422124, 6288631.393789791, 802999.1035239202, 6952285.839571498], `Actual: "${JSON.stringify(extent)}"`);
      })
      .then(() => Modules.open('static-export'))
      .get('[data-cy=add-layout]')
      .click()
      .then(() => LayoutPreviewMap.getReference())
      .should((map) => {
        const extent = map.getViewExtent();
        expect(extent).deep.equal([-3583756.783093121, 3753471.4109037006, 4526100.544359253, 9487445.82245759], `Actual: "${JSON.stringify(extent)}"`);
      })
      .get('[data-cy=pdf-export]')
      .click()
      .then(() => LongOperation.done(50_000))
      .then(() => Download.currentFileAsBlob())
      .should((pdf) => {
        expect(pdf.size).greaterThan(50_000);
      })
      .get('[data-cy=close-solicitation-modal]')
      .click();
  });
});
