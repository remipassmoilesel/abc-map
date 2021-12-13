import { useServices } from '../../core/hooks';
import { useCallback, useEffect } from 'react';
import { Env } from '../../core/utils/Env';
import { prefixedTranslation } from '../../i18n/i18n';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('TokenWatcher.tsx');

const t = prefixedTranslation('TokenWatcher:');

export function TokenWatcher() {
  const { authentication, toasts } = useServices();

  // When a tab is focused after a long period of inactivity, we must try to renew token or login
  const handleFocus = useCallback(() => {
    authentication
      .renewToken()
      .catch((err) => {
        logger.error('Cannot renew token: ', err);
        toasts.info(t('You_are_disconnected'));
        return authentication.anonymousLogin();
      })
      .catch((err) => {
        logger.error('Cannot login as anonymous: ', err);
        toasts.genericError(err);
      });
  }, [authentication, toasts]);

  /**
   * Display warning if tab reload or is closing, in order to prevent modifications loss
   * @param ev
   * @private
   */
  const warnBeforeUnload = useCallback((ev: BeforeUnloadEvent | undefined): string => {
    const message = t('Modification_in_progress_will_be_lost');
    if (ev) {
      ev.returnValue = message;
    }
    return message;
  }, []);

  useEffect(() => {
    if (!Env.isE2e()) {
      window.addEventListener('beforeunload', warnBeforeUnload);
      window.addEventListener('unload', warnBeforeUnload);
      window.addEventListener('focus', handleFocus);
      authentication.watchToken();
    }

    return () => {
      if (!Env.isE2e()) {
        window.removeEventListener('beforeunload', warnBeforeUnload);
        window.removeEventListener('unload', warnBeforeUnload);
        window.removeEventListener('focus', handleFocus);
        authentication.unwatchToken();
      }
    };
  }, [authentication, handleFocus, warnBeforeUnload]);

  return <></>;
}
