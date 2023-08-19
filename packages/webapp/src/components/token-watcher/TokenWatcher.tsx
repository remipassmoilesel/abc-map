/**
 * Copyright © 2023 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { useServices } from '../../core/useServices';
import { useCallback, useEffect } from 'react';
import { Env } from '../../core/utils/Env';
import { prefixedTranslation } from '../../i18n/i18n';
import { Logger, UserStatus } from '@abc-map/shared';
import { useAppSelector } from '../../core/store/hooks';

const logger = Logger.get('TokenWatcher.tsx');

const t = prefixedTranslation('TokenWatcher:');

export function TokenWatcher() {
  const { authentication, toasts } = useServices();
  const userStatus = useAppSelector((st) => st.authentication.userStatus);

  // When a tab is focused after a long period of inactivity, we must try to renew token or login
  const handleFocus = useCallback(() => {
    authentication
      .renewToken()
      .catch((err) => {
        logger.error('Cannot renew token: ', err);

        if (userStatus === UserStatus.Authenticated) {
          toasts.info(t('You_are_disconnected'));
        }

        return authentication.anonymousLogin();
      })
      .catch((err) => {
        logger.error('Cannot login as anonymous: ', err);
        toasts.genericError(err);
      });
  }, [authentication, toasts, userStatus]);

  // We watch token and renew it when it is about to expire
  useEffect(() => {
    if (!Env.isE2e()) {
      window.addEventListener('focus', handleFocus);
      authentication.watchToken();
    }

    return () => {
      if (!Env.isE2e()) {
        window.removeEventListener('focus', handleFocus);
        authentication.unwatchToken();
      }
    };
  }, [authentication, handleFocus]);

  return <></>;
}
