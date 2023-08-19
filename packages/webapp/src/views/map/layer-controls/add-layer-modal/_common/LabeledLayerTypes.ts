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
import { LayerType } from '@abc-map/shared';

export interface LabeledLayerType {
  id: LayerType;
  i18nLabel: string;
}

export class LabeledLayerTypes {
  public static readonly Predefined: LabeledLayerType = {
    id: LayerType.Predefined,
    i18nLabel: 'Predefined_basemap',
  };

  public static readonly Vector: LabeledLayerType = {
    id: LayerType.Vector,
    i18nLabel: 'Geometry_layer',
  };

  public static readonly Xyz: LabeledLayerType = {
    id: LayerType.Xyz,
    i18nLabel: 'XYZ_layer',
  };

  public static readonly Wms: LabeledLayerType = {
    id: LayerType.Wms,
    i18nLabel: 'WMS_layer',
  };

  public static readonly Wmts: LabeledLayerType = {
    id: LayerType.Wmts,
    i18nLabel: 'WMTS_layer',
  };

  public static readonly All: LabeledLayerType[] = [
    LabeledLayerTypes.Predefined,
    LabeledLayerTypes.Vector,
    LabeledLayerTypes.Xyz,
    LabeledLayerTypes.Wms,
    LabeledLayerTypes.Wmts,
  ];

  public static find(value: string): LabeledLayerType | undefined {
    return LabeledLayerTypes.All.find((type) => type.id === value);
  }
}
