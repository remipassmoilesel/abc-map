import { TopBar } from './TopBar';
import { Toasts } from './Toasts';

export class DataStore {
  public static importByName(name: string): Cypress.Chainable<any> {
    return TopBar.dataStore()
      .get('[data-cy=data-store-search]')
      .type(name)
      .type('{enter}')
      .wait(800) // We must wait a little for search because cards may already exists
      .get('[data-cy=artefact-name]')
      .contains(name)
      .get('[data-cy=import-artefact]')
      .click()
      .then(() => Toasts.assertText('Import terminé !'));
  }
}
