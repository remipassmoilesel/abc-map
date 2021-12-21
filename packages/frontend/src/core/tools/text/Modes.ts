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

import { ToolMode } from '../ToolMode';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { ToolModeHelper } from '../common/ToolModeHelper';
import { noModifierKeys, primaryAction, singleClick } from 'ol/events/condition';

export const EditText: ToolMode = {
  name: 'EditText',
  i18nLabel: 'EditText',
  shortcut: 'e',
};

export const Select: ToolMode = {
  name: 'Select',
  i18nLabel: 'Select',
  shortcut: 'r',
};

export const MoveMap: ToolMode = {
  name: 'MoveMap',
  i18nLabel: 'MoveMap',
  shortcut: 't',
};

export const Modes = { EditText, Select, MoveMap };

export const Conditions = {
  EditText: (ev: MapBrowserEvent<UIEvent>) => primaryAction(ev) && singleClick(ev) && noModifierKeys(ev) && ToolModeHelper.is(ev.map, Modes.EditText),
  Select: (ev: MapBrowserEvent<UIEvent>) => primaryAction(ev) && singleClick(ev) && noModifierKeys(ev) && ToolModeHelper.is(ev.map, Modes.Select),
  MoveMap: (ev: MapBrowserEvent<UIEvent>) => ToolModeHelper.is(ev.map, Modes.MoveMap),
};
