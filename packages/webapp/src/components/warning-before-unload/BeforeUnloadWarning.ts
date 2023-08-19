import { Env } from '../../core/utils/Env';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('WarningBeforeUnload:');

let instance: BeforeUnloadWarning | undefined;

export class BeforeUnloadWarning {
  public static get() {
    if (!instance) {
      instance = new BeforeUnloadWarning();
    }
    return instance;
  }

  public setEnabled(enabled: boolean): void {
    // Warning is never enabled in E2E tests
    if (Env.isE2e()) {
      return;
    }

    if (!enabled) {
      window.removeEventListener('beforeunload', this.handleUnload);
      window.removeEventListener('unload', this.handleUnload);
      return;
    }

    window.addEventListener('beforeunload', this.handleUnload);
    window.addEventListener('unload', this.handleUnload);
  }

  private handleUnload(ev: BeforeUnloadEvent | undefined): string {
    const message = t('Modification_in_progress_will_be_lost');
    if (ev) {
      ev.returnValue = message;
    }
    return message;
  }
}
