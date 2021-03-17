import { getAbcWindow } from '@abc-map/frontend-shared';

export class Env {
  public static isE2e(): boolean {
    return !!getAbcWindow().Cypress;
  }
}
