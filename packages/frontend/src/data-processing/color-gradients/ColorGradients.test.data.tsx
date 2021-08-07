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

import { StyleProperties } from '@abc-map/shared';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { GradientClass } from './GradientClass';
import { Stats } from '../_common/stats/Stats';
import { ClassificationAlgorithm } from '../_common/algorithm/Algorithm';
import { nanoid } from 'nanoid';
import chroma from 'chroma-js';
import { TestHelper } from '../../core/utils/test/TestHelper';
import { asNumberOrString, isValidNumber } from '../../core/utils/numbers';

export const testGradientClasses = (algo: ClassificationAlgorithm, numberOfClasses: number): GradientClass[] => {
  const values = TestHelper.regionsOfFrance()
    .map((reg) => asNumberOrString(reg.popPercent))
    .filter(isValidNumber) as number[];
  const classes = Stats.classify(algo, numberOfClasses, values);
  const colorFunc = chroma.scale(['blue', 'red']).domain([0, numberOfClasses]).classes(numberOfClasses);

  return classes.map((cl, i) => ({
    ...cl,
    id: nanoid(),
    color: colorFunc(i).hex(),
  }));
};

export function featuresToComparableValues(features: Feature<Geometry>[], dataJoinBy: string): { color: string; value: number; joinedBy: number | string }[] {
  return features
    .map((f) => ({ color: f.get(StyleProperties.FillColor1), value: f.get('gradient-value'), joinedBy: f.get(dataJoinBy) }))
    .sort((a, b) => a.joinedBy - b.joinedBy);
}
