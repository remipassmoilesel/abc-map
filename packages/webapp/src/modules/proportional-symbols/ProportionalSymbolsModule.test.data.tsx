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

import { TestDataSource } from '../../core/data/data-source/TestDataSource';
import { FeatureWrapper } from '../../core/geo/features/FeatureWrapper';
import { LayerFactory } from '../../core/geo/layers/LayerFactory';
import shuffle from 'lodash/shuffle';
import range from 'lodash/range';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import Point from 'ol/geom/Point';
import { DataRow } from '../../core/data/data-source/DataSource';
import { StyleProperties } from '@abc-map/shared';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

export const testDataSource1 = (): TestDataSource =>
  TestDataSource.from([
    {
      id: 1,
      data: {
        code_reg: '01',
        name: 'Ain',
        population: 647_634,
      },
    },
    {
      id: 2,
      data: {
        code_reg: '02',
        name: 'Aisne',
        population: 533_316,
      },
    },
    {
      id: 3,
      data: {
        code_reg: '03',
        name: 'Allier',
        population: 337_171,
      },
    },
    {
      id: 4,
      data: {
        code_reg: '04',
        name: 'Alpes-de-Haute-Provence',
        population: 164_068,
      },
    },
  ]);

export const testGeometryLayer1 = (): VectorLayerWrapper => {
  const feat1 = FeatureWrapper.create(new Point([1, 1]));
  feat1.unwrap().setId(1);
  feat1.unwrap().set('CODE', '01');

  const feat2 = FeatureWrapper.create(new Point([2, 2]));
  feat2.unwrap().setId(2);
  feat2.unwrap().set('CODE', '02');

  const feat3 = FeatureWrapper.create(new Point([3, 3]));
  feat3.unwrap().setId(3);
  feat3.unwrap().set('CODE', '03');

  const feat4 = FeatureWrapper.create(new Point([4, 4]));
  feat4.unwrap().setId(4);
  feat4.unwrap().set('CODE', '04');

  const layer = LayerFactory.newVectorLayer();
  layer.getSource().addFeatures([feat1.unwrap(), feat2.unwrap(), feat3.unwrap(), feat4.unwrap()]);

  return layer;
};

export const testDataSource2 = () => {
  const dataset: Partial<DataRow>[] = shuffle([
    { data: { code: 1, value: 377.730620008599 } },
    { data: { code: 2, value: 1089.36697551601 } },
    { data: { code: 3, value: 1634.1807405057 } },
    { data: { code: 4, value: 2504.8084547204 } },
    { data: { code: 5, value: 8728.32490346905 } },
    { data: { code: 6, value: 12069.9719351141 } },
    { data: { code: 7, value: 27630.7566577526 } },
    { data: { code: 8, value: 30139.2938373139 } },
    { data: { code: 9, value: 31840.4276059089 } },
    { data: { code: 10, value: 31978.3795751166 } },
    { data: { code: 11, value: 32431.2716032757 } },
    { data: { code: 12, value: 39530.669755169 } },
    { data: { code: 13, value: 48059.6549778473 } },
    { data: { code: 14, value: 57717.6338705954 } },
    { data: { code: 15, value: 71134.3725767045 } },
    { data: { code: 16, value: 73367.0697261891 } },
    { data: { code: 17, value: 83550.7462972935 } },
    { data: { code: 18, value: 84841.8565894046 } },
  ]);
  return TestDataSource.from(dataset);
};

export const testGeometryLayer2 = (): VectorLayerWrapper => {
  const features = range(1, 19).map((n) => {
    const feature = FeatureWrapper.create(new Point([n, n]));
    feature.unwrap().set('code', n);
    return feature.unwrap();
  });

  const layer = LayerFactory.newVectorLayer();
  layer.getSource().addFeatures(features);

  return layer;
};

export const testDataSource3 = () => {
  const dataset: Partial<DataRow>[] = [
    { data: { code: 0, value: 5 } },
    { data: { code: 1, value: 0 } },
    { data: { code: 2, value: 2 } },
    { data: { code: 3, value: 3 } },
  ];
  return TestDataSource.from(dataset);
};

export const testGeometryLayer3 = (): VectorLayerWrapper => {
  const features = range(0, 4).map((n) => {
    const feature = FeatureWrapper.create(new Point([n, n]));
    feature.unwrap().set('code', n);
    return feature.unwrap();
  });

  const layer = LayerFactory.newVectorLayer();
  layer.getSource().addFeatures(features);

  return layer;
};

export function featuresToComparableValues(features: Feature<Geometry>[], dataJoinBy: string): { size: number; value: number; joinedBy: number | string }[] {
  return features
    .map((f) => ({ size: f.get(StyleProperties.PointSize), value: f.get('point-value'), joinedBy: f.get(dataJoinBy) }))
    .sort((a, b) => a.value - b.value);
}
