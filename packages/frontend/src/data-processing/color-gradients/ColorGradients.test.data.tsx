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

import { TestDataSource } from '../../core/data/data-source/TestDataSource';
import { FeatureWrapper } from '../../core/geo/features/FeatureWrapper';
import { LayerFactory } from '../../core/geo/layers/LayerFactory';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { StyleProperties } from '@abc-map/shared';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { Polygon } from 'ol/geom';
import { GradientClass } from './GradientClass';
import { Stats } from '../_common/stats/Stats';
import { ClassificationAlgorithm } from '../_common/algorithm/Algorithm';
import { nanoid } from 'nanoid';
import chroma from 'chroma-js';

const regions = [
  {
    _id: 1,
    code: 1,
    name: 'Auvergne-Rhône-Alpes',
    population: 8_092_598,
    popPercent: 0.124,
  },
  {
    _id: 2,
    code: 2,
    name: 'Bourgogne-Franche-Comté',
    population: 2_786_205,
    popPercent: 0.043,
  },
  {
    _id: 3,
    code: 3,
    name: 'Bretagne',
    population: 3_371_297,
    popPercent: 0.051,
  },
  {
    _id: 4,
    code: 4,
    name: 'Centre - Val de Loire',
    population: 2_562_431,
    popPercent: 0.039,
  },
  {
    _id: 5,
    code: 5,
    name: 'Corse',
    population: 349_273,
    popPercent: 0.005,
  },
  {
    _id: 6,
    code: 6,
    name: 'Grand Est',
    population: 5_524_817,
    popPercent: 0.084,
  },
  {
    _id: 7,
    code: 7,
    name: 'Hauts-de-France',
    population: 5_977_462,
    popPercent: 0.091,
  },
  {
    _id: 8,
    code: 8,
    name: 'Île-de-France',
    population: 12_326_429,
    popPercent: 0.188,
  },
  {
    _id: 9,
    code: 9,
    name: 'Normandie',
    population: 3_306_092,
    popPercent: 0.05,
  },
  {
    _id: 10,
    code: 10,
    name: 'Nouvelle Aquitaine',
    population: 6_039_767,
    popPercent: 0.092,
  },
  {
    _id: 11,
    code: 11,
    name: 'Occitanie',
    population: 5_985_751,
    popPercent: 0.091,
  },
  {
    _id: 12,
    code: 12,
    name: 'Pays de la Loire',
    population: 3_838_060,
    popPercent: 0.058,
  },
  {
    _id: 13,
    code: 13,
    name: 'Provence-Alpes-Côte d’Azur',
    population: 5_089_661,
    popPercent: 0.078,
  },
];

export const testDataSource1 = (): TestDataSource => TestDataSource.from(regions);

export const testGradientClasses = (algo: ClassificationAlgorithm, numberOfClasses: number): GradientClass[] => {
  const values = regions.map((reg) => reg.popPercent);
  const classes = Stats.classify(algo, numberOfClasses, values);
  const colorFunc = chroma.scale(['blue', 'red']).domain([0, numberOfClasses]).classes(numberOfClasses);
  return classes.map((cl, i) => ({
    ...cl,
    id: nanoid(),
    color: colorFunc(i).hex(),
  }));
};

export const testGeometryLayer1 = (): VectorLayerWrapper => {
  const features = regions.map((reg) => {
    const feat = FeatureWrapper.create(
      new Polygon([
        [
          [reg.code, reg.code],
          [reg.code + 1, reg.code + 1],
          [reg.code, reg.code],
        ],
      ])
    );
    feat.unwrap().setId(reg.code);
    feat.unwrap().set('CODE', reg.code);
    return feat.unwrap();
  });

  const layer = LayerFactory.newVectorLayer();
  layer.getSource().addFeatures(features);

  return layer;
};

export function featuresToComparableValues(features: Feature<Geometry>[], dataJoinBy: string): { color: string; value: number; joinedBy: number | string }[] {
  return features
    .map((f) => ({ color: f.get(StyleProperties.FillColor1), value: f.get('gradient-value'), joinedBy: f.get(dataJoinBy) }))
    .sort((a, b) => a.joinedBy - b.joinedBy);
}
