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

import { LayerFactory } from '../../geo/layers/LayerFactory';
import { LayerDataSource } from './LayerDataSource';
import { DataSourceType } from './DataSource';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';

describe('LayerDataSource', () => {
  it('getId()', () => {
    const layer = LayerFactory.newVectorLayer();
    const data = new LayerDataSource(layer);

    expect(data.getId()).toEqual(layer.getId());
  });

  it('getType()', () => {
    const data = new LayerDataSource(LayerFactory.newVectorLayer());

    expect(data.getType()).toEqual(DataSourceType.VectorLayer);
  });

  it('getRows() should return rows', async () => {
    const feat1 = new Feature({ label: 'value1', altitude: 1234 });
    feat1.setId(1);
    const feat2 = new Feature({ label: 'value2', altitude: 5678 });
    feat2.setId(2);
    const source = new VectorSource();
    source.addFeatures([feat1, feat2]);
    const data = new LayerDataSource(LayerFactory.newVectorLayer(source));

    const rows = await data.getRows();

    expect(rows).toEqual([
      { id: 1, data: { label: 'value1', altitude: 1234 }, metadata: { selected: false } },
      { id: 2, data: { label: 'value2', altitude: 5678 }, metadata: { selected: false } },
    ]);
  });

  it('getRows() should return empty array', async () => {
    const source = new VectorSource();
    const data = new LayerDataSource(LayerFactory.newVectorLayer(source));

    const rows = await data.getRows();

    expect(rows).toHaveLength(0);
  });
});
