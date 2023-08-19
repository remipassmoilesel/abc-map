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

import { AbcWindow, E2eMap } from '@abc-map/shared';
import Chainable = Cypress.Chainable;

export class SharedMap {
  public static getComponent() {
    return cy.get(`[data-cy=shared-map]`);
  }

  public static getReference(): Chainable<E2eMap> {
    return this.getComponent() // We fetch component to wait for initialization
      .then(() => cy.window())
      .then((_window) => {
        const window: AbcWindow = _window as any;
        const map = window.abc.sharedMap;
        expect(map).not.undefined;
        return map as E2eMap;
      });
  }
}
