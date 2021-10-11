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

export declare type Algorithm = ScaleAlgorithm | ClassificationAlgorithm;

export declare type GradientAlgorithm = ScaleAlgorithm.Interpolated | ClassificationAlgorithm;

export enum ScaleAlgorithm {
  Absolute = 'Absolute',
  Interpolated = 'Interpolated',
}

export enum ClassificationAlgorithm {
  EqualIntervals = 'EqualIntervals',
  Quantiles = 'Quantiles',
  NaturalBreaks = 'NaturalBreaks',
}

export function allAlgorithms(): Algorithm[] {
  return [...Object.values(ScaleAlgorithm), ...Object.values(ClassificationAlgorithm)];
}

export function isScaleAlgorithm(v: Algorithm): v is ScaleAlgorithm {
  return Object.values(ScaleAlgorithm).some((a) => a === v);
}

export function isClassificationAlgorithm(v: Algorithm): v is ClassificationAlgorithm {
  return Object.values(ClassificationAlgorithm).some((a) => a === v);
}

export function isGradientAlgorithm(v: Algorithm): v is GradientAlgorithm {
  return v === ScaleAlgorithm.Interpolated || Object.values(ClassificationAlgorithm).some((a) => a === v);
}

export interface LabeledAlgorithm {
  label: string;
  value: Algorithm;
}

export class LabeledAlgorithms {
  public static readonly Absolute: LabeledAlgorithm = {
    value: ScaleAlgorithm.Absolute,
    label: 'Absolute_scale',
  };

  public static readonly Interpolated: LabeledAlgorithm = {
    value: ScaleAlgorithm.Interpolated,
    label: 'Interpolated_scale',
  };

  public static readonly EqualIntervals: LabeledAlgorithm = {
    value: ClassificationAlgorithm.EqualIntervals,
    label: 'Equal_intervals',
  };

  public static readonly Quantiles: LabeledAlgorithm = {
    value: ClassificationAlgorithm.Quantiles,
    label: 'Quantiles',
  };

  public static readonly NaturalBreaks: LabeledAlgorithm = {
    value: ClassificationAlgorithm.NaturalBreaks,
    label: 'Natural_breaks',
  };

  public static readonly All: LabeledAlgorithm[] = [
    LabeledAlgorithms.Absolute,
    LabeledAlgorithms.Interpolated,
    LabeledAlgorithms.EqualIntervals,
    LabeledAlgorithms.Quantiles,
    LabeledAlgorithms.NaturalBreaks,
  ];
}
