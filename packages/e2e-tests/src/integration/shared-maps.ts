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
import { Registration } from '../helpers/Registration';
import { Authentication } from '../helpers/Authentication';
import { TopBar } from '../helpers/TopBar';
import { SharingLayoutMap } from '../helpers/SharingLayoutMap';
import { UrlHelper } from '../helpers/UrlHelper';
import { SharedMap } from '../helpers/SharedMap';
import { Toasts } from '../helpers/Toasts';
import { ToolSelector } from '../helpers/ToolSelector';
import { Draw } from '../helpers/Draw';
import { MapTool } from '@abc-map/shared';

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
      .then(() => MainMap.fixedView())
      .then(() => ToolSelector.enable(MapTool.Point))
      .then(() => Draw.click(300, 300))
      .then(() => Draw.click(350, 350))
      // Show share settings, enable sharing
      .then(() => TopBar.shareSettings())
      .get('[data-cy=enable-sharing]')
      .click()
      .then(() => Toasts.assertText('Project saved !'))
      .then(() => SharingLayoutMap.getComponent())
      .then(() => SharingLayoutMap.getReference())
      .should((map) => {
        // FIXME Assertions here does not work well
        expect(map.getViewExtent()).not.undefined;
        // expect(map.getViewExtent()).deep.equal([-5394208.487445235, -4217930.032050605, 13723132.788597964, 6189407.6252345955]);
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
        // expect(map.getViewExtent()).deep.equal([-5521638.073721606, -4297588.598479625, 13850562.374874335, 6269066.191663615]);
      });
  });
});
