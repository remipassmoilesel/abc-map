/**
 * Copyright © 2026 Rémi Pace.
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

import type Map from 'ol/Map';
import type { MapTool } from '@abc-map/shared';
import type { ToolMode } from './ToolMode';
import type { DefaultVectorSource } from '../geo/layers/LayerWrapper';

export interface Tool {
  // Unique ID of tool
  getId(): MapTool;

  // Modes that can influence behavior of tool. First mode is default one.
  getModes(): ToolMode[];

  // I18n id of name of tool
  getI18nLabel(): string;

  // Icon of tool
  getIcon(): string;

  // Called when tool is enabled
  setup(map: Map, source: DefaultVectorSource): void;

  modeChanged?(mode: ToolMode): void;

  // Called when tool is disabled
  dispose(): void;
}
