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

import { LayerWrapper, VectorLayerWrapper } from '../../geo/layers/LayerWrapper';
import { DataRow, DataSource, DataSourceType } from './DataSource';
import { Logger } from '@abc-map/shared';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { prefixedTranslation } from '../../../i18n/i18n';

const logger = Logger.get('LayerDataSource.ts');

const t = prefixedTranslation('LayerDataSource:');

// FIXME: check if layer with numeric properties are always returned as numbers
export class LayerDataSource implements DataSource {
  constructor(private layer: VectorLayerWrapper) {
    if (!layer.getId()) {
      throw new Error('Layer id is mandatory');
    }
  }

  public getId(): string {
    return this.layer.getId() as string;
  }

  public getName(): string {
    return this.layer.getName() || t('Layer_without_name');
  }

  public getType(): DataSourceType {
    return DataSourceType.VectorLayer;
  }

  public async getRows(): Promise<DataRow[]> {
    const features = this.layer.getSource().getFeatures();
    const rows: DataRow[] = features.map((f) => FeatureWrapper.from(f).toDataRow());

    if (features.length !== rows.length) {
      return Promise.reject(new Error(`Some features does not have an id. Original array: ${features.length} rows: ${rows.length}`));
    }

    return rows;
  }

  public getLayer(): LayerWrapper {
    return this.layer;
  }
}
