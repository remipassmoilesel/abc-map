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

export interface LabeledLayerType {
  id: string;
  label: string;
}

export class LabeledLayerTypes {
  public static readonly BaseMap: LabeledLayerType = {
    id: 'BaseMap',
    label: 'Fond de carte',
  };

  public static readonly Vector: LabeledLayerType = {
    id: 'Vector',
    label: 'Couche de géométries',
  };

  public static readonly Xyz: LabeledLayerType = {
    id: 'Xyz',
    label: 'Couche distante (XYZ)',
  };

  public static readonly Wms: LabeledLayerType = {
    id: 'Wms',
    label: 'Couche distante (WMS)',
  };

  public static readonly All: LabeledLayerType[] = [LabeledLayerTypes.BaseMap, LabeledLayerTypes.Vector, LabeledLayerTypes.Xyz, LabeledLayerTypes.Wms];

  public static find(value: string): LabeledLayerType | undefined {
    return LabeledLayerTypes.All.find((type) => type.id === value);
  }
}
