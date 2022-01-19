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
import { MainMap } from '../helpers/MainMap';
import { Routes } from '../helpers/Routes';

describe('Search on map', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can search', function () {
    cy.visit(Routes.map().format())
      .then(() => MainMap.fixedView())
      .then(() => MainMap.getComponent())
      .get('[data-cy=search-menu]')
      .click()
      .get('[data-cy=search-on-map]')
      .clear()
      .type('Cournonterral')
      .wait(1_000)
      .get('[data-cy=search-result]')
      .eq(1)
      .click()
      .wait(2_000)
      .then(() => MainMap.getReference())
      .should((map) => {
        const extent = map.getViewExtent();
        expect(extent).deep.equals([408038.177297224, 5394212.793119373, 419930.7475875498, 5400357.287769375]);
      });
  });
});
