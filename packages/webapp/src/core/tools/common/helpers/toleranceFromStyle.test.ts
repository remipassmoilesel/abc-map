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

import { toleranceFromStyle } from './toleranceFromStyle';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import Point from 'ol/geom/Point';

describe('toleranceFromStyle()', () => {
  it('should return correct value', () => {
    const feature = FeatureWrapper.create(new Point([1, 1]));
    feature.setStyleProperties({ point: { size: 8 }, stroke: { width: 6 } });
    expect(toleranceFromStyle(feature.unwrap(), 2)).toEqual(14);
  });
});
