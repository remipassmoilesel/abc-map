/**
 * Copyright © 2021 Rémi Pace.
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

import React, { useEffect, useState } from 'react';
import { ModalEvent, ModalEventType } from '../../core/ui/typings';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import { useServices } from '../../core/useServices';
import Cls from './LongOperationModal.module.scss';
import { Loader } from './Loader';

const logger = Logger.get('LongOperationModal.tsx');

const t = prefixedTranslation('LongOperationModal:');

function LongOperationModal() {
  const { modals } = useServices();
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const handleVisibilityChanged = (ev: ModalEvent) => {
      if (ModalEventType.ShowLongOperationModal === ev.type) {
        setVisible(true);
        setProcessing(ev.processing);
      } else if (ModalEventType.LongOperationModalClosed === ev.type) {
        setVisible(false);
      } else {
        logger.error('Unhandled event: ', ev);
      }
    };

    modals.addListener(ModalEventType.ShowLongOperationModal, handleVisibilityChanged);
    modals.addListener(ModalEventType.LongOperationModalClosed, handleVisibilityChanged);
    return () => {
      modals.removeListener(ModalEventType.ShowLongOperationModal, handleVisibilityChanged);
      modals.removeListener(ModalEventType.LongOperationModalClosed, handleVisibilityChanged);
    };
  }, [modals]);

  if (!visible) {
    return <div />;
  }

  return (
    <div className={Cls.modal}>
      {processing && (
        <div className={Cls.frame}>
          <h1>{t('Things_are_getting_hot')}</h1>
          <div className={'mb-5'}>{t('Dont_try_to_run_away')}</div>
          <Loader />
        </div>
      )}
      {!processing && (
        <div className={Cls.frame}>
          <h1>{t('Done')}</h1>
          <div className={Cls.icon} data-cy={'long-operation-done'}>
            🙌
          </div>
        </div>
      )}
    </div>
  );
}

export default LongOperationModal;
