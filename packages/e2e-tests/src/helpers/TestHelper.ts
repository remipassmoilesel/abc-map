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

import Chainable = Cypress.Chainable;
import { Routes } from './Routes';

export class TestHelper {
  public static init(): Chainable<any> {
    return (
      cy
        // We set viewport
        .viewport(1980, 1080)
        // We set default language
        .visit(Routes.map().format(), {
          onBeforeLoad(win) {
            Object.defineProperty(win.navigator, 'language', { value: 'en-US' });
            Object.defineProperty(win.navigator, 'languages', { value: ['en'] });
            Object.defineProperty(win.navigator, 'accept_languages', { value: ['en'] });
          },
        })
        // We clear local storage data (and redux store persistence)
        // Despite docs says it run automatically before each test, it does not clear side menu states
        .clearLocalStorage()
    );
  }
}
