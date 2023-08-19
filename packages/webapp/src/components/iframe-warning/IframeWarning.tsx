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

import React, { useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { FullscreenModal } from '../fullscreen-modal/FullscreenModal';
import mainLogo from '../../assets/main-icon.png';
import Cls from '../device-warning-modal/DeviceWarningModal.module.scss';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useIsIframe } from './useIsIframe';

const logger = Logger.get('IframeWarning.ts');

const allowedRouteRegexp = /\/shared-map\//i;

function isRouteAllowed(route: string) {
  return route.match(allowedRouteRegexp);
}

const WAIT_BEFORE_DISMISS = 30;

export function IframeWarning() {
  const { t } = useTranslation('IframeWarning');
  const [dismissed, setDismissed] = useState(false);
  const [displayedSec, setDisplayedSec] = useState(0);

  const isIframe = useIsIframe();
  const location = useLocation();
  const visible = isIframe && !dismissed && !isRouteAllowed(location.pathname);

  const handleDismissed = useCallback(() => setDismissed(true), []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const interval = setInterval(() => {
      setDisplayedSec((st) => {
        if (st > WAIT_BEFORE_DISMISS) {
          clearInterval(interval);
        }
        return st + 1;
      });
    }, 1_000);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) {
    return <div />;
  }

  return (
    <FullscreenModal className={Cls.modal}>
      <img src={mainLogo} alt={'Abc-Map'} />

      <h1 className={Cls.title}>{t('Iframe_problem')}</h1>
      <div className={Cls.explanation1}>{t('The_app_is_displayed_in_an_iframe_and_that_s_not_normal')}</div>
      <div className={clsx(Cls.explanation2)}>
        {t('To_avoid_any_security_risk_you_must_close_this_window_and_open_a_new_one_This_message_should_no_longer_appear')}
      </div>
      <div className={'d-flex align-items-center justify-content-center m-5'}>
        <div className={'me-3'}>
          {t('Wait_a_few_seconds')} ({Math.max(WAIT_BEFORE_DISMISS - displayedSec, 0)})
        </div>

        <button onClick={handleDismissed} disabled={displayedSec < WAIT_BEFORE_DISMISS} className={'btn btn-outline-secondary'}>
          {t('Hide_this_message')}
        </button>
      </div>
    </FullscreenModal>
  );
}
