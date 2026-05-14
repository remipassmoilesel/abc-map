/**
 * Copyright © 2026 Rémi Pace.
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

import { TestHelper } from '../helpers/TestHelper.js';
import { MainMap } from '../helpers/MainMap.js';
import { Routes } from '../helpers/Routes.js';
import { Registration } from '../helpers/Registration.js';
import { Authentication } from '../helpers/Authentication.js';
import { SharingLayoutMap } from '../helpers/SharingLayoutMap.js';
import { UrlHelper } from '../helpers/UrlHelper.js';
import { SharedMap } from '../helpers/SharedMap.js';
import { Toasts } from '../helpers/Toasts.js';
import { ToolSelector } from '../helpers/ToolSelector.js';
import { Draw } from '../helpers/Draw.js';
import { ModuleId, MapTool } from '@abc-map/shared';
import { Modules } from '../helpers/Modules.js';

describe('Shared maps', function () {
  beforeEach(() => {
    const email = Registration.newEmail();

    TestHelper.init()
      .then(() => Registration.newUser(email))
      .then(() => Registration.enableAccount(email));
  });

  it('connected user can share map', function () {
    cy.visit(Routes.map().format())
      // Set fixed view, draw
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(300, 300))
      .then(() => Draw.click(350, 350))
      // Show share settings, enable sharing
      .then(() => Modules.open(ModuleId.SharedMapSettings))
      .get('[data-cy=enable-sharing]')
      .click()
      .then(() => Toasts.assertText('Project saved !'))
      .then(() => SharingLayoutMap.getComponent())
      .then(() => SharingLayoutMap.getReference())
      .should((map) => {
        expect(map.getViewExtent()).not.undefined;
        // FIXME Assertions here does not work well
        // expect(map.getViewExtent()).deep.equal(
        //   [-1637414.044381916, -2174473.7008304745, 9966338.345534643, 4145951.294014464],
        //   'Actual: ' + JSON.stringify(map.getViewExtent())
        // );
      })
      // Publish map
      .get('[data-cy=publish]')
      .click()
      .then(() => Toasts.assertText('Project saved !'))
      // Get public URL of map
      .get('[data-cy=sharing-codes]')
      .click()
      .get('[data-cy=public-url]')
      .invoke('val')
      .then((publicUrl) => {
        expect(publicUrl).to.match(/^http:\/\/localhost:[0-9]+\/[a-z]{2}\/shared-map\//);

        // We close modal, disconnect then visit shared map
        return cy
          .get('[data-cy=close-modal]')
          .click()
          .then(() => Authentication.logout())
          .visit(UrlHelper.adaptToConfig(publicUrl as string));
      })
      .then(() => SharedMap.getReference())
      .should((map) => {
        // FIXME Assertions here does not work well
        expect(map.getViewExtent()).not.undefined;
        // expect(map.getViewExtent()).deep.equal([-5521638.073721606, ...
      });
  });
});
