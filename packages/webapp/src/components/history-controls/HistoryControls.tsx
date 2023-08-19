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

import React, { useCallback } from 'react';
import { Logger } from '@abc-map/shared';
import { HistoryKey } from '../../core/history/HistoryKey';
import { prefixedTranslation } from '../../i18n/i18n';
import { useAppSelector } from '../../core/store/hooks';
import { useServices } from '../../core/useServices';
import Cls from './HistoryControls.module.scss';
import { IconDefs } from '../icon/IconDefs';
import { FaIcon } from '../icon/FaIcon';

const logger = Logger.get('HistoryControls.tsx');

interface Props {
  historyKey: HistoryKey;
}

const t = prefixedTranslation('HistoryControls:');

function HistoryControls(props: Props) {
  const { historyKey } = props;
  const capabilities = useAppSelector((state) => state.ui.historyCapabilities)[historyKey];
  const { history, toasts } = useServices();

  const canUndo = capabilities?.canUndo ?? false;
  const canRedo = capabilities?.canRedo ?? false;

  const handleUndo = useCallback(() => {
    history.undo(historyKey).catch((err) => {
      logger.error('Undo error: ', err);
      toasts.genericError(err);
    });
  }, [historyKey, history, toasts]);

  const handleRedo = useCallback(() => {
    history.redo(historyKey).catch((err) => {
      logger.error('Redo error: ', err);
      toasts.genericError(err);
    });
  }, [historyKey, history, toasts]);

  return (
    <div className={`control-block ${Cls.historyControls}`}>
      <button onClick={handleUndo} disabled={!canUndo} data-cy={'undo'} type={'button'} className={'btn btn-outline-secondary'}>
        <FaIcon icon={IconDefs.faUndo} className={'mr-2'} /> {t('Undo')}
      </button>
      <button onClick={handleRedo} disabled={!canRedo} data-cy={'redo'} type={'button'} className={'btn btn-outline-secondary'}>
        <FaIcon icon={IconDefs.faRedo} className={'mr-2'} /> {t('Redo')}
      </button>
    </div>
  );
}

export default HistoryControls;
