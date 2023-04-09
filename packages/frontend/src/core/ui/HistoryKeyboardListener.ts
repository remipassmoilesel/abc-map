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

import Mousetrap from 'mousetrap';
import { prefixedTranslation } from '../../i18n/i18n';
import { Logger } from '@abc-map/shared';
import { HistoryKey } from '../history/HistoryKey';
import { getServices, Services } from '../Services';

const logger = Logger.get('HistoryKeyboardListener.ts');

const t = prefixedTranslation('HistoryKeyboardListener:');

export class HistoryKeyboardListener {
  public static create(key: HistoryKey) {
    return new HistoryKeyboardListener(getServices(), key);
  }

  constructor(private services: Services, private key: HistoryKey) {}

  public initialize(): void {
    Mousetrap.bind('ctrl+z', this.undo);
    Mousetrap.bind('ctrl+shift+z', this.redo);
  }

  public destroy(): void {
    Mousetrap.unbind('ctrl+z');
    Mousetrap.unbind('ctrl+shift+z');
  }

  private undo = () => {
    const { toasts, history } = this.services;

    if (history.canUndo(this.key)) {
      history.undo(this.key).catch((err) => logger.error(err));
    } else {
      toasts.info(t('Nothing_more_to_undo'));
    }
  };

  private redo = () => {
    const { toasts, history } = this.services;

    if (history.canRedo(this.key)) {
      history.redo(this.key).catch((err) => logger.error(err));
    } else {
      toasts.info(t('Nothing_more_to_redo'));
    }
  };
}
