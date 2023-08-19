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

import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector';
import { Select } from 'ol/interaction';
import { withGeometryOfType } from '../helpers/common-conditions';
import { LayerWrapper } from '../../../geo/layers/LayerWrapper';
import { DefaultTolerancePx } from '../constants';
import { SelectEvent } from 'ol/interaction/Select';
import { SupportedGeometry } from './SupportedGeometry';
import { FeatureStyle } from '@abc-map/shared';
import Map from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { getSelectionFromMap } from '../../../geo/feature-selection/getSelectionFromMap';

export declare type StyleSelectionHandler = (style: FeatureStyle, feat: FeatureWrapper) => void;

export interface Options {
  condition: (ev: MapBrowserEvent<UIEvent>) => boolean;
}

/**
 * This object bundles selection interactions.
 *
 * It also listens vector source for removed or added features, then update selection.
 * - If features added, per example with "duplicate" button, and selected, they are added to selection.
 * - If features removed, per example with "delete" button, they are removed from selection.
 */
export class SelectionInteractionsBundle {
  public onStyleSelected?: StyleSelectionHandler;

  private map?: Map;
  private select?: Select;

  constructor(private options: Options) {}

  public setup(map: Map, source: VectorSource<Geometry>, geometryTypes: SupportedGeometry[]) {
    this.map = map;

    const selection = getSelectionFromMap(map);

    this.select = new Select({
      condition: this.options.condition,
      toggleCondition: this.options.condition,
      layers: (lay) => LayerWrapper.from(lay).isActive(),
      filter: (feat) => withGeometryOfType(feat, geometryTypes),
      // Warning: here we must use null to not manage styles with Select interaction
      // Otherwise modification of style can be 'restored' from a bad state
      style: null,
      hitTolerance: DefaultTolerancePx,
      features: selection.getFeatureCollection(),
    });

    this.select.on('select', (ev: SelectEvent) => {
      // We update selection
      selection.add(ev.selected);
      selection.remove(ev.deselected);

      // We dispatch style of last selected feature
      if (ev.selected.length) {
        const last = FeatureWrapper.from(ev.selected[ev.selected.length - 1]);
        this.onStyleSelected && this.onStyleSelected(last.getStyleProperties(), last);
      }
    });

    map.addInteraction(this.select);
  }

  public dispose() {
    if (this.select) {
      this.select.dispose();
      this.map?.removeInteraction(this.select);
    }
  }
}
