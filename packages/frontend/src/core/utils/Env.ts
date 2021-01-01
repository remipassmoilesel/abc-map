import { getAbcWindow } from './getWindow';

export class Env {
  public static isE2e(): boolean {
    return !!getAbcWindow().Cypress;
  }
}
