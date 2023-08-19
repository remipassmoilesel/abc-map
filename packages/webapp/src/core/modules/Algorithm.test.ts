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

import { allAlgorithms, ClassificationAlgorithm, isClassificationAlgorithm, isScaleAlgorithm, LabeledAlgorithms, ScaleAlgorithm } from './Algorithm';

describe('Algorithm', () => {
  it('allAlgorithms()', () => {
    const algos = allAlgorithms();
    const doubleValues = algos.filter((a) => algos.filter((b) => a === b).length > 1);

    expect(algos).toHaveLength(5);
    expect(doubleValues).toEqual([]);
  });

  it('isScaleAlgorithm()', () => {
    expect(isScaleAlgorithm(ScaleAlgorithm.Interpolated)).toBe(true);
    expect(isScaleAlgorithm(ClassificationAlgorithm.NaturalBreaks)).toBe(false);
  });

  it('isClassificationAlgorithm()', () => {
    expect(isClassificationAlgorithm(ClassificationAlgorithm.NaturalBreaks)).toBe(true);
    expect(isClassificationAlgorithm(ScaleAlgorithm.Interpolated)).toBe(false);
  });

  it('LabeledAlgorithm.All', () => {
    const missing = allAlgorithms().filter((a) => !LabeledAlgorithms.All.some((b) => b.value === a));
    expect(missing).toEqual([]);
  });
});
