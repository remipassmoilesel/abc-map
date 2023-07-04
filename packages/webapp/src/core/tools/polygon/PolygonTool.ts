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
import { AbcGeometryType, FeatureStyle, Logger, MapTool } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Map from 'ol/Map';
import Icon from '../../../assets/tool-icons/polygon.inline.svg';
import { DrawInteractionsBundle, GetStyleFunc } from '../common/interactions/DrawInteractionsBundle';
import { HistoryKey } from '../../history/HistoryKey';
import { HistoryService } from '../../history/HistoryService';
import { MainStore } from '../../store/store';
import { MapActions } from '../../store/map/actions';
import { MoveMapInteractionsBundle } from '../common/interactions/MoveMapInteractionsBundle';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';
import { ToolMode } from '../ToolMode';
import { CommonConditions, CommonModes } from '../common/common-modes';
import { FinishDrawingButton } from '../common/finish-button/FinishDrawingButton';
import { getSelectionFromMap } from '../../geo/feature-selection/getSelectionFromMap';

const logger = Logger.get('PolygonTool.ts');

export class PolygonTool implements Tool {
  private move?: MoveMapInteractionsBundle;
  private selection?: SelectionInteractionsBundle;
  private draw?: DrawInteractionsBundle;
  private finishDrawing?: FinishDrawingButton;
  private map?: Map;

  constructor(private store: MainStore, private history: HistoryService) {}

  public getId(): MapTool {
    return MapTool.Polygon;
  }

  public getIcon(): string {
    return Icon;
  }

  public getModes(): ToolMode[] {
    return [CommonModes.CreateGeometry, CommonModes.ModifyGeometry, CommonModes.MoveMap];
  }

  public getI18nLabel(): string {
    return 'Polygons';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    this.map = map;

    // Interactions for map view manipulation
    this.move = new MoveMapInteractionsBundle({ condition: CommonConditions.MoveMap });
    this.move.setup(map);

    const selection = getSelectionFromMap(map);

    // Selection for modifications
    this.selection = new SelectionInteractionsBundle({ condition: CommonConditions.Selection });
    this.selection.onStyleSelected = (style: FeatureStyle) => this.store.dispatch(MapActions.setDrawingStyle({ stroke: style.stroke, fill: style.fill }));
    this.selection.setup(map, source, [AbcGeometryType.POLYGON, AbcGeometryType.MULTI_POLYGON]);

    // Draw interactions
    const getStyle: GetStyleFunc = () => {
      const style = this.store.getState().map.currentStyle;
      return { fill: style.fill, stroke: style.stroke };
    };

    // Modification is allowed in creation because we must be able to modify a just created geometry
    this.draw = new DrawInteractionsBundle({
      type: AbcGeometryType.POLYGON,
      getStyle,
      drawCondition: CommonConditions.CreateGeometry,
      modifyCondition: CommonConditions.ModifyGeometry,
      deleteVertex: CommonConditions.DeleteVertex,
    });
    this.draw.onNewChangeset = (t) => this.history.register(HistoryKey.Map, t);
    this.draw.onDeleteChangeset = (t) => this.history.remove(HistoryKey.Map, t);
    this.draw.onFeatureAdded = (feat) => selection.add([feat.unwrap()]);
    this.draw.onDrawAborted = () => this.removeFinishButton();

    this.draw.setup(map, source);

    // Finish drawing button
    const addFinishButton = () => {
      this.removeFinishButton();

      this.finishDrawing = new FinishDrawingButton();
      this.finishDrawing.onFinishDrawing = () => {
        this.draw?.finishDrawing();
      };
      map.addInteraction(this.finishDrawing);
    };

    this.draw.onDrawStart = () => addFinishButton();
    this.draw.onDrawEnd = this.removeFinishButton;
    this.draw.onModifyStart = this.removeFinishButton;
    this.draw.onModifyEnd = this.removeFinishButton;
  }

  public modeChanged(): void {
    this.draw?.abortDrawing();

    this.removeFinishButton();
  }

  public dispose() {
    this.move?.dispose();
    this.selection?.dispose();
    this.draw?.dispose();

    this.removeFinishButton();
  }

  private removeFinishButton = () => {
    if (this.finishDrawing) {
      this.finishDrawing.dispose();
      this.finishDrawing && this.map?.removeInteraction(this.finishDrawing);
      this.finishDrawing = undefined;
    }
  };
}
