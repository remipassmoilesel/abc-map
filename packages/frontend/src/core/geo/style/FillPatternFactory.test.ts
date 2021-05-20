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

import { FillPatternFactory } from './FillPatternFactory';
import { FillProperties } from './FeatureStyle';
import { FillPatterns } from '@abc-map/shared';

describe('FillPatternFactory', () => {
  let factory: FillPatternFactory;

  beforeEach(() => {
    factory = new FillPatternFactory();
  });

  it('should work', () => {
    const properties: FillProperties = {
      color1: '#fff',
      color2: '#000',
    };
    expect(factory.create({ ...properties, pattern: FillPatterns.Flat })).toBeUndefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.Circles })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.Squares })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.HatchingVertical })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.HatchingHorizontal })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.HatchingObliqueRight })).toBeDefined();
    expect(factory.create({ ...properties, pattern: FillPatterns.HatchingObliqueLeft })).toBeDefined();
  });
});
