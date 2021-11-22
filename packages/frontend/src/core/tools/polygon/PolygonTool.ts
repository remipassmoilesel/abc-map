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
import { FeatureStyle, Logger, MapTool } from '@abc-map/shared';
import GeometryType from 'ol/geom/GeometryType';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import Icon from '../../../assets/tool-icons/polygon.inline.svg';
import { DrawInteractionsBundle, GetStyleFunc } from '../common/interactions/DrawInteractionsBundle';
import { HistoryKey } from '../../history/HistoryKey';
import { HistoryService } from '../../history/HistoryService';
import { MainStore } from '../../store/store';
import { MapActions } from '../../store/map/actions';
import { MoveInteractionsBundle } from '../common/interactions/MoveInteractionsBundle';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';

const logger = Logger.get('PolygonTool.ts');

export class PolygonTool implements Tool {
  private move?: MoveInteractionsBundle;
  private selection?: SelectionInteractionsBundle;
  private draw?: DrawInteractionsBundle;

  constructor(private store: MainStore, private history: HistoryService) {}

  public getId(): MapTool {
    return MapTool.Polygon;
  }

  public getIcon(): string {
    return Icon;
  }

  public getI18nLabel(): string {
    return 'Polygons';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    this.move = new MoveInteractionsBundle();
    this.move.setup(map);

    // Select with shift + click
    this.selection = new SelectionInteractionsBundle();
    this.selection.onStyleSelected = (style: FeatureStyle) => this.store.dispatch(MapActions.setDrawingStyle({ stroke: style.stroke, fill: style.fill }));
    this.selection.setup(map, source, [GeometryType.POLYGON, GeometryType.MULTI_POLYGON]);

    // Draw interactions
    this.draw = new DrawInteractionsBundle(GeometryType.POLYGON);
    this.draw.onNewTask = (t) => this.history.register(HistoryKey.Map, t);
    this.draw.onDeleteTask = (t) => this.history.remove(HistoryKey.Map, t);

    const getStyle: GetStyleFunc = () => {
      const style = this.store.getState().map.currentStyle;
      return { fill: style.fill, stroke: style.stroke };
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
