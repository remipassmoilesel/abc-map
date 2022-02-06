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

export class TopBar {
  public static landing(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=landing]').click();
  }

  public static map(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=map]').click();
  }

  public static dataStore(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=data-store]').click();
  }

  public static dataProcessing(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=data-processing]').click();
  }

  public static export(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=export]').click();
  }

  public static shareSettings(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=share-settings]').click();
  }

  public static documentation(): Chainable<any> {
    return cy.get('[data-cy=top-bar] [data-cy=help]').click();
  }
}
