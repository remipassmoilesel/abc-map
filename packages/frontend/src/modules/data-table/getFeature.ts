/**
 * Copyright © 2022 Rémi Pace.
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

import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { FeatureWrapper } from '../../core/geo/features/FeatureWrapper';
import { DataRow } from '../../core/data/data-source/DataSource';

export function getFeature(layer: VectorLayerWrapper, row: DataRow): FeatureWrapper | undefined {
  const feature = layer
    .getSource()
    .getFeatures()
    .find((f) => f.getId() === row.id);
  if (!feature) {
    return;
  }

  return FeatureWrapper.from(feature);
}
