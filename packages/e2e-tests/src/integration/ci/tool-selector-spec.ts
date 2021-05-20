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

import { ToolSelector } from '../../helpers/ToolSelector';
import { FrontendRoutes, MapTool } from '@abc-map/shared';
import { TestHelper } from '../../helpers/TestHelper';

describe('ToolSelector', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('selector should change current tool', () => {
    cy.visit(FrontendRoutes.map().raw());

    for (const tool in MapTool) {
      cy.then(() => ToolSelector.enable(tool as MapTool))
        .then(() => ToolSelector.getActive())
        .should((active) => expect(active).equal(tool));
    }
  });
});
