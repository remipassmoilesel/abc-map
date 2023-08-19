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

import { Stats } from './Stats';
import shuffle from 'lodash/shuffle';
import { ClassificationAlgorithm } from './Algorithm';

describe('Stats', () => {
  it('proportionality()', () => {
    expect(Stats.proportionality(0, 0, 400, 100)).toEqual(0);
    expect(Stats.proportionality(800, 0, 400, 100)).toEqual(2);
    expect(Stats.proportionality(40_000, 0, 400, 200)).toEqual(100);
    expect(Stats.proportionality(400_000, 0, 400, 100)).toEqual(100);
  });

  it('interpolated()', () => {
    expect(Stats.interpolated(0, 0, 0, 10, 400)).toEqual(0);
    expect(Stats.interpolated(1, 0, 0, 10, 400)).toEqual(40);
    expect(Stats.interpolated(10, 0, 0, 10, 400)).toEqual(400);
    expect(Stats.interpolated(20, 0, 0, 10, 400)).toEqual(800);
  });

  describe('classify()', () => {
    const data = [
      140_022, 143_280, 153_115, 162_753, 165_702, 239_071, 265_099, 279_210, 296_794, 310_147, 327_775, 331_745, 348_997, 377_719, 525_503, 652_474, 662_244,
      692_839, 1_089_270, 2_048_395,
    ];

    function getData(): number[] {
      return shuffle(data);
    }

    it('ClassificationAlgorithm.EqualIntervals', () => {
      expect(Stats.classify(ClassificationAlgorithm.EqualIntervals, 5, getData())).toEqual([
        { lower: 140_022, upper: 521_696.6 },
        { lower: 521_696.6, upper: 903_371.2 },
        { lower: 903_371.2, upper: 1_285_045.8 },
        { lower: 1_285_045.8, upper: 1_666_720.4 },
        { lower: 1_666_720.4, upper: 2_048_395 },
      ]);
    });

    it('ClassificationAlgorithm.Quantiles', () => {
      expect(Stats.classify(ClassificationAlgorithm.Quantiles, 5, getData())).toEqual([
        { lower: 140022, upper: 164227.5 },
        { lower: 164227.5, upper: 288002 },
        { lower: 288002, upper: 340371 },
        { lower: 340371, upper: 657359 },
        { lower: 657359, upper: 2048395 },
      ]);
    });

    it('ClassificationAlgorithm.NaturalBreaks', () => {
      expect(Stats.classify(ClassificationAlgorithm.NaturalBreaks, 5, getData())).toEqual([
        { lower: 140022, upper: 165702 },
        { lower: 239071, upper: 377719 },
        { lower: 525503, upper: 692839 },
        { lower: 1089270, upper: 1089270 },
        { lower: 2048395, upper: 2048395 },
      ]);
    });
  });
});
