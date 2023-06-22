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

import MapBrowserEvent from 'ol/MapBrowserEvent';
import { FeatureLike } from 'ol/Feature';
import { SupportedGeometry } from '../interactions/SupportedGeometry';

export function withShiftKey(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'shiftKey' in original && original.shiftKey;
}

export function withControlKey(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'ctrlKey' in original && original.ctrlKey;
}

export function withControlKeyOnly(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  return withControlKey(ev) && !withShiftKey(ev) && !withAltKey(ev);
}

export function withAltKey(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'altKey' in original && original.altKey;
}

export function withGeometryOfType(feat: FeatureLike, types: SupportedGeometry[]): boolean {
  const type = feat?.getGeometry()?.getType();
  return (type && !!types.find((t) => t === type)) || false;
}

export function withGeometry(feat: FeatureLike): boolean {
  return !!feat?.getGeometry()?.getType();
}
