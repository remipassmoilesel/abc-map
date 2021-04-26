import { getAbcWindow } from '@abc-map/frontend-commons';

export class Env {
  public static isE2e(): boolean {
    return !!getAbcWindow().Cypress;
  }
}
