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

import { AbstractTool } from '../AbstractTool';
import { Logger, MapTool } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../assets/tool-icons/point.svg';
import { Map } from 'ol';
import { HistoryKey } from '../../history/HistoryKey';
import { defaultInteractions } from '../../geo/map/interactions';
import { DrawInteraction, drawInteractionFactory, GetStyleFunc, HistoryTaskHandler } from '../common/drawInteractionFactory';
import GeometryType from 'ol/geom/GeometryType';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';

const logger = Logger.get('PointTool.tsx');

export class PointTool extends AbstractTool {
  private drawInteractions?: DrawInteraction;

  constructor(store: MainStore, history: HistoryService, private interactionFactory = drawInteractionFactory) {
    super(store, history);
  }

  public getId(): MapTool {
    return MapTool.Point;
  }

  public getIcon(): string {
    return Icon;
  }

  public getI18nLabel(): string {
    return 'CreatePoints';
  }

  protected setupInternal(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    const defaults = defaultInteractions();
    defaults.forEach((i) => map.addInteraction(i));
    this.interactions.push(...defaults);

    // Tool interactions
    const getStyle: GetStyleFunc = () => {
      const style = this.store.getState().map.currentStyle;
      return { point: style.point };
    };

    const handleTask: HistoryTaskHandler = (t) => {
      this.history.register(HistoryKey.Map, t);
    };

    this.drawInteractions = this.interactionFactory(GeometryType.POINT, [GeometryType.POINT, GeometryType.MULTI_POINT], source, getStyle, handleTask);
    this.drawInteractions.interactions.forEach((i) => map.addInteraction(i));
    this.interactions.push(...this.drawInteractions.interactions);
  }

  protected disposeInternal() {
    this.drawInteractions?.dispose();
  }
}
