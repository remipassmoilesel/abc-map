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

import { DataSource } from '../../core/data/data-source/DataSource';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { ScaleAlgorithm } from '../../core/modules/Algorithm';
import { IconName } from '../../assets/point-icons/IconName';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('ProportionalSymbolsModule:');

export interface Parameters {
  newLayerName: string;
  data: {
    source?: DataSource;
    valueField?: string;
    joinBy?: string;
  };
  geometries: {
    layer?: VectorLayerWrapper;
    joinBy?: string;
  };
  symbols: {
    type: IconName;
    color: string;
    sizeMin: number;
    sizeMax: number;
    algorithm: ScaleAlgorithm;
  };
}

export function newParameters(): Parameters {
  return {
    newLayerName: t('Proportional_symbols'),
    data: {},
    geometries: {},
    symbols: {
      type: IconName.Icon0CircleFill,
      color: '#0094e3',
      sizeMin: 20,
      sizeMax: 100,
      algorithm: ScaleAlgorithm.Absolute,
    },
  };
}
