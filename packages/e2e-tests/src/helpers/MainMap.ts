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

import { AbcWindow, E2eMap } from '@abc-map/shared';
import Chainable = Cypress.Chainable;

export class MainMap {
  public static getComponent() {
    return cy.get(`[data-cy=main-map]`);
  }

  public static getReference(): Chainable<E2eMap> {
    return this.getComponent() // We fetch component to wait for initialization
      .then(() => cy.window())
      .then((_window) => {
        const window = _window as unknown as AbcWindow;
        const map = window.abc.mainMap;
        expect(map).not.equals(undefined);
        return map as E2eMap;
      });
  }

  public static fixedView1(): Chainable<any> {
    return this.getReference()
      .then((map) => {
        map.setView(4, 37.41, 8.82);
        return map;
      })
      .wait(600);
  }

  public static fixedView2(): Chainable<any> {
    return this.getReference()
      .then((map) => {
        map.setView(8, 37.41, 8.82);
        return map;
      })
      .wait(600);
  }
}
