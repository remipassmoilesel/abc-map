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
import uuid from 'uuid-random';
import clsx from 'clsx';

const logger = Logger.get('MultipleTabsWarning.ts');

const instanceId = uuid();
const instantiatedAt = Date.now();

interface Message {
  instanceId: string;
  instantiatedAt: number;
}

export function MultipleTabsWarning() {
  const { t } = useTranslation('MultipleTabsWarning');
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) {
      return;
    }

    const channel = new BroadcastChannel('abc-map_multiple-tabs-warning');

    channel.onmessage = function (event: MessageEvent<Message>) {
      logger.debug('Channel message: ', event);
      const fromAnotherInstance = event.data.instanceId !== instanceId;
      const otherIsOlder = event.data.instantiatedAt < instantiatedAt;

      if (fromAnotherInstance && otherIsOlder && !dismissed) {
        setVisible(true);
      }
    };

    const interval = setInterval(() => {
      const message: Message = { instanceId, instantiatedAt };
      channel.postMessage(message);
    }, 2000);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [dismissed]);

  const handleDismissed = useCallback(() => {
    setVisible(false);
    setDismissed(true);
  }, []);

  if (!visible) {
    return <div />;
  }

  return (
    <FullscreenModal className={Cls.modal}>
      <img src={mainLogo} alt={'Abc-Map'} />

      <h1 className={Cls.title}>{t('Multiple_tabs_open')}</h1>
      <div className={Cls.explanation1}>{t('Abc-Map_is_already_open_in_another_tab')}</div>
      <div className={clsx(Cls.explanation2)}>{t('You_may_accidentally_overwrite_your_work')}</div>

      <div className={'d-flex justify-content-end m-5'}>
        <button onClick={handleDismissed} className={'btn btn-outline-secondary'}>
          {t('Hide_this_message')}
        </button>
      </div>
    </FullscreenModal>
  );
}
