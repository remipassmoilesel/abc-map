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

import { Tool } from '../Tool';
import { AbcGeometryType, FeatureStyle, MapTool } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../assets/tool-icons/point.inline.svg';
import Map from 'ol/Map';
import { HistoryKey } from '../../history/HistoryKey';
import { DrawInteractionsBundle, GetStyleFunc } from '../common/interactions/DrawInteractionsBundle';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { MapActions } from '../../store/map/actions';
import { MoveMapInteractionsBundle } from '../common/interactions/MoveMapInteractionsBundle';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';
import { ToolMode } from '../ToolMode';
import { CommonConditions, CommonModes } from '../common/common-modes';
import { getSelectionFromMap } from '../../geo/feature-selection/getSelectionFromMap';

export class PointTool implements Tool {
  private move?: MoveMapInteractionsBundle;
  private selection?: SelectionInteractionsBundle;
  private draw?: DrawInteractionsBundle;

  constructor(private store: MainStore, private history: HistoryService) {}

  public getId(): MapTool {
    return MapTool.Point;
  }

  public getIcon(): string {
    return Icon;
  }

  public getModes(): ToolMode[] {
    return [CommonModes.CreateGeometry, CommonModes.ModifyGeometry, CommonModes.MoveMap];
  }

  public getI18nLabel(): string {
    return 'Points';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    this.move = new MoveMapInteractionsBundle({ condition: CommonConditions.MoveMap });
    this.move.setup(map);

    const globalSelection = getSelectionFromMap(map);

    // Selection for modifications
    this.selection = new SelectionInteractionsBundle({ condition: CommonConditions.Selection });
    this.selection.onStyleSelected = (style: FeatureStyle) => this.store.dispatch(MapActions.setDrawingStyle({ point: style.point }));
    this.selection.setup(map, source, [AbcGeometryType.POINT, AbcGeometryType.MULTI_POINT]);

    // Draw interactions
    const getStyle: GetStyleFunc = () => {
      const style = this.store.getState().map.currentStyle;
      return { point: style.point };
    };

    this.draw = new DrawInteractionsBundle({
      type: AbcGeometryType.POINT,
      getStyle,
      drawCondition: CommonConditions.CreateGeometry,
      modifyCondition: CommonConditions.ModifyGeometry,
    });
    this.draw.onNewChangeset = (t) => this.history.register(HistoryKey.Map, t);
    this.draw.onDeleteChangeset = (t) => this.history.remove(HistoryKey.Map, t);
    this.draw.onFeatureAdded = (feat) => {
      globalSelection.add([feat.unwrap()]);
    };
    this.draw.setup(map, source);
  }

  public modeChanged(): void {
    this.draw?.abortDrawing();
  }

  public dispose() {
    this.move?.dispose();
    this.selection?.dispose();
    this.draw?.dispose();
  }
}
