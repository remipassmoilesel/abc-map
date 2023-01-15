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
import { AbcGeometryType, MapTool } from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../assets/tool-icons/measures.inline.svg';
import Map from 'ol/Map';
import { MoveMapInteractionsBundle } from '../common/interactions/MoveMapInteractionsBundle';
import { SelectionInteractionsBundle } from '../common/interactions/SelectionInteractionsBundle';
import { ToolMode } from '../ToolMode';
import { Conditions, Modes } from './Modes';

/**
 * This tool allows users to select geometries, in order to measure them.
 *
 * Measure logic is in tool panel.
 */
export class MeasureTool implements Tool {
  private move?: MoveMapInteractionsBundle;
  private selection?: SelectionInteractionsBundle;

  public getId(): MapTool {
    return MapTool.Measures;
  }

  public getIcon(): string {
    return Icon;
  }

  public getModes(): ToolMode[] {
    return [Modes.Select, Modes.MoveMap];
  }

  public getI18nLabel(): string {
    return 'Measures';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    this.move = new MoveMapInteractionsBundle({ condition: Conditions.Move });
    this.move.setup(map);

    // Selection for modifications
    this.selection = new SelectionInteractionsBundle({ condition: Conditions.Select });
    this.selection.setup(map, source, [AbcGeometryType.LINE_STRING, AbcGeometryType.MULTI_LINE_STRING, AbcGeometryType.POLYGON, AbcGeometryType.MULTI_POLYGON]);
  }

  public modeChanged(): void {
    this.selection?.clear();
  }

  public deselectAll() {
    this.selection?.clear();
  }

  public dispose() {
    this.deselectAll();

    this.move?.dispose();
    this.selection?.dispose();
  }
}
