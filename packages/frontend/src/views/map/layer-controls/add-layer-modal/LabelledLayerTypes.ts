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

export interface LabelledLayerType {
  id: string;
  label: string;
}

export class LabelledLayerTypes {
  public static readonly Osm: LabelledLayerType = {
    id: 'Osm',
    label: 'Couche OpenStreetMap',
  };

  public static readonly Vector: LabelledLayerType = {
    id: 'Vector',
    label: 'Couche de géométries',
  };

  public static readonly Wms: LabelledLayerType = {
    id: 'Wms',
    label: 'Couche distante (WMS)',
  };

  public static readonly All: LabelledLayerType[] = [LabelledLayerTypes.Osm, LabelledLayerTypes.Vector, LabelledLayerTypes.Wms];

  public static find(value: string): LabelledLayerType | undefined {
    return LabelledLayerTypes.All.find((type) => type.id === value);
  }
}
