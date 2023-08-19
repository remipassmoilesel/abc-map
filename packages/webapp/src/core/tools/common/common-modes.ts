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

import { ToolMode } from '../ToolMode';
import { ToolModeHelper } from './ToolModeHelper';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { noModifierKeys, primaryAction, shiftKeyOnly, singleClick } from 'ol/events/condition';

export const MoveMap: ToolMode = {
  name: 'MoveMap',
  i18nLabel: 'MoveMap',
  shortcut: 't',
};

export const CreateGeometry: ToolMode = {
  name: 'Create',
  i18nLabel: 'Create',
  shortcut: 'e',
};

export const ModifyGeometry: ToolMode = {
  name: 'Modify',
  i18nLabel: 'Modify',
  shortcut: 'r',
};

export const CommonModes = { MoveMap, CreateGeometry, ModifyGeometry };

export const CommonConditions = {
  MoveMap: (ev: MapBrowserEvent<UIEvent>) => ToolModeHelper.is(ev.map, CommonModes.MoveMap),
  Selection: (ev: MapBrowserEvent<UIEvent>) =>
    primaryAction(ev) && singleClick(ev) && noModifierKeys(ev) && ToolModeHelper.is(ev.map, CommonModes.ModifyGeometry),
  CreateGeometry: (ev: MapBrowserEvent<UIEvent>) => primaryAction(ev) && noModifierKeys(ev) && ToolModeHelper.is(ev.map, CommonModes.CreateGeometry),
  // Modification is allowed with modification and creation mode.
  // It allows users to modify just created geometries.
  ModifyGeometry: (ev: MapBrowserEvent<UIEvent>) => primaryAction(ev) && ToolModeHelper.is(ev.map, CommonModes.CreateGeometry, CommonModes.ModifyGeometry),
  // On linux ALT + click is often mapped, so we use shift
  DeleteVertex: (ev: MapBrowserEvent<UIEvent>) =>
    primaryAction(ev) && shiftKeyOnly(ev) && ToolModeHelper.is(ev.map, CommonModes.CreateGeometry, CommonModes.ModifyGeometry),
};
