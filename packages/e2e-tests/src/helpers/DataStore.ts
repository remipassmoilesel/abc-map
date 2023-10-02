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

import { Toasts } from './Toasts';
import { Modules } from './Modules';
import { BundledModuleId } from '@abc-map/shared';

export class DataStore {
  public static importByName(name: string): Cypress.Chainable<any> {
    return Modules.open(BundledModuleId.DataStore)
      .get('[data-cy=data-store-search]')
      .type(name)
      .type('{enter}')
      .wait(800) // We must wait a little for search because cards may already exists
      .get('[data-cy=artefact-name]')
      .eq(0)
      .contains(name)
      .click()
      .get('[data-cy=import-artefact]')
      .click()
      .then(() => Toasts.assertText('Import in progress'))
      .then(() => Toasts.assertText('Import done !'));
  }
}
