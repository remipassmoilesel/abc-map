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

import React, { useCallback } from 'react';
import { Logger } from '@abc-map/shared';
import { HistoryKey } from '../../core/history/HistoryKey';
import { prefixedTranslation } from '../../i18n/i18n';
import { useAppSelector } from '../../core/store/hooks';
import { useServices } from '../../core/hooks';
import Cls from './HistoryControls.module.scss';

const logger = Logger.get('HistoryControls.tsx');

interface Props {
  historyKey: HistoryKey;
}

const t = prefixedTranslation('HistoryControls:');

export function HistoryControls(props: Props) {
  const { historyKey } = props;
  const capabilities = useAppSelector((state) => state.ui.historyCapabilities)[historyKey];
  const { history, toasts } = useServices();

  const canUndo = capabilities?.canUndo ?? false;
  const canRedo = capabilities?.canRedo ?? false;

  const undo = useCallback(() => {
    history.undo(historyKey).catch((err) => {
      logger.error(err);
      toasts.genericError();
    });
  }, [historyKey, history, toasts]);

  const redo = useCallback(() => {
    history.redo(historyKey).catch((err) => {
      logger.error(err);
      toasts.genericError();
    });
  }, [historyKey, history, toasts]);

  return (
    <div className={`control-block ${Cls.historyControls}`}>
      <button onClick={undo} type={'button'} className={'btn btn-outline-secondary'} disabled={!canUndo} data-cy={'undo'}>
        <i className={'fa fa-undo mr-2'} /> {t('Undo')}
      </button>
      <button onClick={redo} type={'button'} className={'btn btn-outline-secondary'} disabled={!canRedo} data-cy={'redo'}>
        <i className={'fa fa-redo mr-2'} /> {t('Redo')}
      </button>
    </div>
  );
}

export default HistoryControls;
