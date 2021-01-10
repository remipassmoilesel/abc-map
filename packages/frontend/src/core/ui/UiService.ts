import { Toasts } from './Toasts';
import { Modals } from './Modals';

export class UiService {
  public readonly toasts;
  public readonly modals;
  constructor() {
    this.toasts = new Toasts();
    this.modals = new Modals();
  }
}
