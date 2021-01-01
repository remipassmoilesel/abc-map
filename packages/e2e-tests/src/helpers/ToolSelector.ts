import { MapTool } from '@abc-map/shared-entities';

export class ToolSelector {
  public static enable(tool: MapTool): Cypress.Chainable<any> {
    return cy.get('[data-cy=tool-selector]').get(`[data-cy=tool-${tool.toLocaleLowerCase()}]`).click();
  }

  public static getActive(): Cypress.Chainable<MapTool | undefined> {
    return cy.get('[data-cy=tool-selector] .btn-primary').then((elem) => {
      const name = (elem.data()['cy'] || '').substr('tool-'.length);
      return Object.values(MapTool).find((t) => t.toLocaleLowerCase() === name) as MapTool;
    });
  }
}
