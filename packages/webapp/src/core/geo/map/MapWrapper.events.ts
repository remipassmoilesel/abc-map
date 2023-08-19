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
import { DimensionsPx } from '../../utils/DimensionsPx';
import { LayerWrapper } from '../layers/LayerWrapper';

export declare type SizeListener = (e: MapSizeChangedEvent) => void;
export declare type TileErrorListener = (e: TileLoadErrorEvent) => void;

export enum EventType {
  MapSizeChanged = 'MapSizeChanged',
  TileLoadError = 'TileLoadError',
}

export class MapSizeChangedEvent extends Event {
  constructor(public readonly dimensions: DimensionsPx) {
    super(EventType.MapSizeChanged);
  }
}

export class TileLoadErrorEvent extends Event {
  constructor(public readonly layer: LayerWrapper) {
    super(EventType.TileLoadError);
  }
}
