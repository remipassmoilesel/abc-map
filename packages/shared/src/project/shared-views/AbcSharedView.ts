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

import { AbcView } from '../AbcView';
import { AbcTextFrame } from '../text-frame';
import { AbcScale } from '../scale';
import { AbcNorth } from '../north';

export interface AbcSharedView {
  id: string;
  title: string;
  view: AbcView;
  layers: LayerState[];
  textFrames: AbcTextFrame[];
  scale?: AbcScale;
  north?: AbcNorth;
}

// Each view can show or hide layers
export interface LayerState {
  layerId: string;
  visible: boolean;
}
