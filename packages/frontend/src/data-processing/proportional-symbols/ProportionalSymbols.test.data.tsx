import { TestDataSource } from '../../core/data/data-source/TestDataSource';
import { FeatureWrapper } from '../../core/geo/features/FeatureWrapper';
import { LayerFactory } from '../../core/geo/layers/LayerFactory';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import Point from 'ol/geom/Point';
import * as _ from 'lodash';
import { DataRow } from '../../core/data/data-source/DataSource';
import { StyleProperties } from '@abc-map/shared-entities';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

export const testDataSource1 = (): TestDataSource =>
  TestDataSource.from([
    {
      _id: 1,
      code_reg: '01',
      name: 'Ain',
      population: 647_634,
    },
    {
      _id: 2,
      code_reg: '02',
      name: 'Aisne',
      population: 533_316,
    },
    {
      _id: 3,
      code_reg: '03',
      name: 'Allier',
      population: 337_171,
    },
    {
      _id: 4,
      code_reg: '04',
      name: 'Alpes-de-Haute-Provence',
      population: 164_068,
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
  const dataset: Partial<DataRow>[] = _.shuffle([
    { code: 1, value: 377.730620008599 },
    { code: 2, value: 1089.36697551601 },
    { code: 3, value: 1634.1807405057 },
    { code: 4, value: 2504.8084547204 },
    { code: 5, value: 8728.32490346905 },
    { code: 6, value: 12069.9719351141 },
    { code: 7, value: 27630.7566577526 },
    { code: 8, value: 30139.2938373139 },
    { code: 9, value: 31840.4276059089 },
    { code: 10, value: 31978.3795751166 },
    { code: 11, value: 32431.2716032757 },
    { code: 12, value: 39530.669755169 },
    { code: 13, value: 48059.6549778473 },
    { code: 14, value: 57717.6338705954 },
    { code: 15, value: 71134.3725767045 },
    { code: 16, value: 73367.0697261891 },
    { code: 17, value: 83550.7462972935 },
    { code: 18, value: 84841.8565894046 },
  ]);
  return TestDataSource.from(dataset);
};

export const testGeometryLayer2 = (): VectorLayerWrapper => {
  const features = _.range(1, 19).map((n) => {
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
    { code: 0, value: 5 },
    { code: 1, value: 0 },
    { code: 2, value: 2 },
    { code: 3, value: 3 },
  ];
  return TestDataSource.from(dataset);
};

export const testGeometryLayer3 = (): VectorLayerWrapper => {
  const features = _.range(0, 4).map((n) => {
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
