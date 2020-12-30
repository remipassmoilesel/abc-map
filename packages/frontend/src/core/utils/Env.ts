import { getAbcWindow } from '../AbcWindow';

export class Env {
  public static isE2e(): boolean {
    return !!getAbcWindow().Cypress;
  }
}
