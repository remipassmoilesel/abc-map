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

import { getServices, Services } from '../../../core/Services';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../../i18n/i18n';
import Mousetrap from 'mousetrap';
import { RemoveLayoutsChangeset } from '../../../core/history/changesets/layouts/RemoveLayoutsChangeset';

const logger = Logger.get('LayoutKeyboardListener.ts');

const t = prefixedTranslation('core:LayoutKeyboardListener.');

export class LayoutKeyboardListener {
  public static create() {
    return new LayoutKeyboardListener(getServices());
  }

  constructor(private services: Services) {}

  public initialize(): void {
    Mousetrap.bind('del', this.deleteActiveLayout);
    Mousetrap.bind('ctrl+z', this.undo);
    Mousetrap.bind('ctrl+shift+z', this.redo);
  }

  public destroy(): void {
    Mousetrap.unbind('del');
    Mousetrap.unbind('ctrl+z');
    Mousetrap.unbind('ctrl+shift+z');
  }

  private deleteActiveLayout = () => {
    const { history, toasts, project } = this.services;

    const layout = project.getActiveLayout();
    if (!layout) {
      toasts.info(t('Nothing_to_delete'));
      return;
    }

    const apply = async () => {
      const cs = RemoveLayoutsChangeset.create([layout]);
      await cs.apply();
      history.register(HistoryKey.Layout, cs);
    };

    apply().catch((err) => logger.error('Cannot delete layout: ', err));
  };

  private undo = () => {
    const { toasts, history } = this.services;

    if (history.canUndo(HistoryKey.Layout)) {
      history.undo(HistoryKey.Layout).catch((err) => logger.error(err));
    } else {
      toasts.info(t('Nothing_more_to_undo'));
    }
  };

  private redo = () => {
    const { toasts, history } = this.services;

    if (history.canRedo(HistoryKey.Layout)) {
      history.redo(HistoryKey.Layout).catch((err) => logger.error(err));
    } else {
      toasts.info(t('Nothing_more_to_redo'));
    }
  };
}
