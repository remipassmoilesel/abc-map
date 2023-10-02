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

import 'cypress-file-upload';
import { AbcProjectMetadata, BundledModuleId, LayerType, MapTool } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { MainMap } from '../helpers/MainMap';
import { LayerControls } from '../helpers/LayerControls';
import { Routes } from '../helpers/Routes';
import { Modules } from '../helpers/Modules';
import { TopBar } from '../helpers/TopBar';
import { Project } from '../helpers/Project';
import { ToolSelector } from '../helpers/ToolSelector';
import { Draw } from '../helpers/Draw';
import { Store } from '../helpers/Store';

describe('Auto save', function () {
  describe('As a visitor', function () {
    beforeEach(() => {
      TestHelper.init();
    });

    it('should save features and layers', function () {
      cy.visit(Routes.map().format())
        .then(() => Project.newProject())
        // We rename project
        .then(() => Modules.open(BundledModuleId.ProjectManagement))
        .get('[data-cy=edit-project-name]')
        .click()
        .get('[data-cy=prompt-input]')
        .clear()
        .type("That's a good project")
        .get('[data-cy=prompt-confirm]')
        .click()
        // We add layers
        .then(() => TopBar.map())
        .then(() => LayerControls.addWmsLayerWithCredentials())
        .then(() => LayerControls.addVectorLayer())
        // We draw features
        .then(() => ToolSelector.enable(MapTool.Point))
        // Create point
        .then(() => Draw.click(300, 300))
        .then(() => Draw.click(400, 400))
        .then(() => Draw.click(500, 500))
        // We wait a little then reload
        .wait(1500)
        .reload()
        .wait(500)
        // Assert
        .then(() => Store.getReference())
        .then((store) => {
          const metadata: AbcProjectMetadata | undefined = store.getState().project.metadata;
          expect(metadata?.name).equal("That's a good project");
        })
        .then(() => MainMap.getReference())
        .should((map) => {
          const layers = map.getLayersMetadata();
          expect(layers).length(4);
          expect(layers[0].type).equal(LayerType.Predefined);
          expect(layers[1].type).equal(LayerType.Vector);
          expect(layers[2].type).equal(LayerType.Wms);
          expect(layers[3].type).equal(LayerType.Vector);

          const features = map.getActiveLayerFeatures();
          expect(features.length).equal(3);
          expect(features.map((f) => f.getGeometry()?.getType())).deep.equal(['Point', 'Point', 'Point']);
        });
    });
  });
});
