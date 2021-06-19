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

import { ckmeans, equalIntervalBreaks, quantileSorted } from 'simple-statistics';
import { toPrecision } from '../../../core/utils/numbers';
import { ClassificationAlgorithm } from '../algorithm/Algorithm';
import { Class } from './Class';

export class Stats {
  public static proportionality(value: number, x: number, y: number, max: number): number {
    if (y === 0) {
      throw new Error('y must be > 0');
    }
    // FIXME: is this the best thing to do ?
    if (x === 0) {
      x = 1;
    }

    const result = Math.round((value * x) / y);
    if (result > max) {
      return max;
    }
    return result;
  }

  public static interpolated(value: number, xMin: number, yMin: number, xMax: number, yMax: number): number {
    const a = (yMax - yMin) / (xMax - xMin);
    const b = -a * xMin + yMin;
    return Math.round(a * value + b);
  }

  public static classify(method: ClassificationAlgorithm, numberOfClasses: number, data: number[]) {
    if (!data.length) {
      throw new Error('Invalid data');
    }

    if (ClassificationAlgorithm.EqualIntervals === method) {
      return this.equalIntervals(numberOfClasses, data);
    } else if (ClassificationAlgorithm.Quantiles === method) {
      return this.quantileIntervals(numberOfClasses, data);
    } else if (ClassificationAlgorithm.NaturalBreaks === method) {
      return this.ckmeansIntervals(numberOfClasses, data);
    } else {
      throw new Error(`Unhandled algorithm: ${method}`);
    }
  }

  private static equalIntervals(numberOfClasses: number, data: number[]): Class[] {
    const bounds = equalIntervalBreaks(data, numberOfClasses).map((i) => toPrecision(i));
    return this.boundsToClasses(bounds);
  }

  // Warning: interval bounds are "rounded" if data length is even
  private static quantileIntervals(numberOfClasses: number, data: number[]): Class[] {
    const copy = data.slice().sort((a, b) => a - b);

    const bounds = [];
    const step = toPrecision(1 / numberOfClasses, 1);
    for (let i = 0; i <= 1; i += step) {
      const q = quantileSorted(copy, toPrecision(i, 1));
      bounds.push(toPrecision(q));
    }

    return this.boundsToClasses(bounds);
  }

  private static ckmeansIntervals(numberOfClasses: number, data: number[]): Class[] {
    return ckmeans(data, numberOfClasses).map((cluster) => {
      const lower = toPrecision(cluster[0]);
      const upper = toPrecision(cluster[cluster.length - 1]);
      return { lower, upper };
    });
  }

  private static boundsToClasses(bounds: number[]) {
    if (!bounds.length) {
      throw new Error('Invalid bounds');
    }

    const classes: Class[] = [];
    for (let i = 0; i < bounds.length - 1; i++) {
      classes[i] = { lower: bounds[i], upper: bounds[i + 1] };
    }
    return classes;
  }
}
