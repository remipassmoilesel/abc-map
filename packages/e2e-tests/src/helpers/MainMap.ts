import { AbcWindow, E2eMap } from '@abc-map/frontend-commons';
import Chainable = Cypress.Chainable;

export class MainMap {
  public static getComponent() {
    return cy.get(`[data-cy=main-map]`);
  }

  public static getReference(): Chainable<E2eMap> {
    return cy.window().then((_window) => {
      const window: AbcWindow = _window as any;
      const map = window.abc.mainMap;
      expect(map).not.equals(undefined);
      return map as E2eMap;
    });
  }
}
