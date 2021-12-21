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
import { RemoveFeaturesChangeset } from '../../../core/history/changesets/features/RemoveFeaturesChangeset';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../../i18n/i18n';
import Mousetrap from 'mousetrap';

const logger = Logger.get('MapKeyboardListener.ts');

const t = prefixedTranslation('core:MapKeyboardListener.');

export class MapKeyboardListener {
  public static create() {
    return new MapKeyboardListener(getServices());
  }

  constructor(private services: Services) {}

  public initialize(): void {
    Mousetrap.bind('del', this.deleteSelectedFeatures);
    Mousetrap.bind('ctrl+z', this.undo);
    Mousetrap.bind('ctrl+shift+z', this.redo);
  }

  public destroy(): void {
    Mousetrap.unbind('del');
    Mousetrap.unbind('ctrl+z');
    Mousetrap.unbind('ctrl+shift+z');
  }

  private deleteSelectedFeatures = () => {
    const { history, geo, toasts } = this.services;

    const map = geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    const features = map.getSelectedFeatures();
    if (!layer || !features.length) {
      toasts.info(t('You_must_select_features_first'));
      return;
    }

    features.forEach((f) => f.setSelected(false));

    const cs = new RemoveFeaturesChangeset(layer.getSource(), features);
    cs.apply().catch((err) => logger.error('Cannot delete features: ', err));
    history.register(HistoryKey.Map, cs);
  };

  private undo = () => {
    const { toasts, history } = this.services;

    if (history.canUndo(HistoryKey.Map)) {
      history.undo(HistoryKey.Map).catch((err) => logger.error(err));
    } else {
      toasts.info(t('Nothing_more_to_undo'));
    }
  };

  private redo = () => {
    const { toasts, history } = this.services;

    if (history.canRedo(HistoryKey.Map)) {
      history.redo(HistoryKey.Map).catch((err) => logger.error(err));
    } else {
      toasts.info(t('Nothing_more_to_redo'));
    }
  };
}
