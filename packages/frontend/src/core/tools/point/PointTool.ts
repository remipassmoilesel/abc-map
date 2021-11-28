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

import { Tool } from '../Tool';
import { FeatureStyle, MapTool } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../assets/tool-icons/point.inline.svg';
import Map from 'ol/Map';
import { HistoryKey } from '../../history/HistoryKey';
import { DrawInteractionsBundle, GetStyleFunc } from '../common/interactions/DrawInteractionsBundle';
import GeometryType from 'ol/geom/GeometryType';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { MapActions } from '../../store/map/actions';
import { MoveInteractionsBundle } from '../common/interactions/MoveInteractionsBundle';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';

export class PointTool implements Tool {
  private move?: MoveInteractionsBundle;
  private selection?: SelectionInteractionsBundle;
  private draw?: DrawInteractionsBundle;

  constructor(private store: MainStore, private history: HistoryService) {}

  public getId(): MapTool {
    return MapTool.Point;
  }

  public getIcon(): string {
    return Icon;
  }

  public getI18nLabel(): string {
    return 'Points';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    this.move = new MoveInteractionsBundle();
    this.move.setup(map);

    // Select with shift + click
    this.selection = new SelectionInteractionsBundle();
    this.selection.onStyleSelected = (style: FeatureStyle) => this.store.dispatch(MapActions.setDrawingStyle({ point: style.point }));
    this.selection.setup(map, source, [GeometryType.POINT, GeometryType.MULTI_POINT]);

    // Draw interactions
    this.draw = new DrawInteractionsBundle(GeometryType.POINT);
    this.draw.onNewTask = (t) => this.history.register(HistoryKey.Map, t);
    this.draw.onDeleteTask = (t) => this.history.remove(HistoryKey.Map, t);

    const getStyle: GetStyleFunc = () => {
      const style = this.store.getState().map.currentStyle;
      return { point: style.point };
    };

    this.draw.setup(map, source, this.selection.getFeatures(), getStyle);
  }

  public deselectAll() {
    this.selection?.clear();
  }

  public dispose() {
    this.deselectAll();

    this.move?.dispose();
    this.selection?.dispose();
    this.draw?.dispose();
  }
}
