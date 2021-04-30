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

import { Logger } from '@abc-map/frontend-commons';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import VectorSource from 'ol/source/Vector';
import { FeatureSelected } from './EditPropertiesEvent';
import { Interaction } from 'ol/interaction';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { findFeatureNearCursor } from '../common/findFeatureNearCursor';
import { withMainButton, withShiftKey } from '../common/common-conditions';

// TODO: test

const logger = Logger.get('EditPropertiesInteraction.ts', 'debug');

export interface Options {
  source: VectorSource;
}

export class EditPropertiesInteraction extends Interaction {
  private readonly source: VectorSource;

  constructor(private options: Options) {
    super();
    this.source = options.source;
  }

  /**
   * Return true to continue event dispatch
   * @param event
   */
  public handleEvent(event: MapBrowserEvent<UIEvent>): boolean {
    if (withShiftKey(event) || !withMainButton(event)) {
      return true;
    }

    if (MapBrowserEventType.POINTERDOWN === event.type) {
      return this.handlePointerDown(event);
    }
    return true;
  }

  protected handlePointerDown(event: MapBrowserEvent<UIEvent>): boolean {
    const feature = findFeatureNearCursor(event, this.source);
    if (!feature) {
      logger.debug('No feature found');
      return true;
    }

    // TODO: test dispatch
    this.dispatchEvent(new FeatureSelected(feature));
    return false;
  }
}
