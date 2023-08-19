/**
 * Copyright © 2023 Rémi Pace.
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

import { MapTool, StyleProperties } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { ToolSelector } from '../helpers/ToolSelector';
import { Draw } from '../helpers/Draw';
import { MainMap } from '../helpers/MainMap';
import { Routes } from '../helpers/Routes';
import { Project } from '../helpers/Project';

describe('Tool Text', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can add text', function () {
    cy.visit(Routes.map().format())
      .then(() => Project.newProject())
      .then(() => MainMap.fixedView1())
      .then(() => MainMap.getComponent())
      .then(() => ToolSelector.enable(MapTool.Point))
      // Draw 2 points
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      // Add text
      .then(() => ToolSelector.enable(MapTool.Text))
      .then(() => Draw.click(150, 150))
      .get('[data-cy=text-box]')
      .clear()
      .type('A beautiful label')
      .get('[data-cy=text-box-validate]')
      .click()
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();

        expect(features).length(2);
        expect(features[0].get(StyleProperties.TextValue)).undefined;
        expect(features[1].get(StyleProperties.TextValue)).equal('A beautiful label');
      });
  });
});
