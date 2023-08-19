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

import { getServices, Services } from '../../core/Services';
import { HistoryKey } from '../../core/history/HistoryKey';
import { RemoveFeaturesChangeset } from '../../core/history/changesets/features/RemoveFeaturesChangeset';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import Mousetrap from 'mousetrap';
import { HistoryKeyboardListener } from '../../core/ui/HistoryKeyboardListener';

const logger = Logger.get('MapKeyboardListener.ts');

const t = prefixedTranslation('MapKeyboardListener:');

export class MainMapKeyboardListener {
  public static create() {
    return new MainMapKeyboardListener(getServices());
  }

  private historyListeners?: HistoryKeyboardListener;
  constructor(private services: Services) {}

  public initialize(): void {
    this.historyListeners = HistoryKeyboardListener.create(HistoryKey.Map);
    this.historyListeners.initialize();

    Mousetrap.bind('del', this.deleteSelectedFeatures);
  }

  public destroy(): void {
    this.historyListeners?.destroy();

    Mousetrap.unbind('del');
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

    map.getSelection().remove(features);

    const cs = new RemoveFeaturesChangeset(layer.getSource(), features);
    cs.execute().catch((err) => logger.error('Cannot delete features: ', err));
    history.register(HistoryKey.Map, cs);
  };
}
