import { AbcWindow, E2eMap } from '@abc-map/shared-entities';
import Chainable = Cypress.Chainable;

export class MainMap {
  public static getSelector(): string {
    return `[data-cy=main-map]`;
  }

  public static getComponent(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.getSelector());
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
