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

export interface ProcessingResult {
  status: Status;
  /**
   * Number of features processed without errors
   */
  featuresProcessed: number;
  /**
   * Number of invalid features
   */
  invalidFeatures: number;
  /**
   * Values that cannot be processed as numbers
   */
  invalidValues: string[];
  /**
   * Data rows that have not been found by join key
   */
  missingDataRows: string[];
}

export enum Status {
  /**
   * Processing is terminated and some features have been processed
   */
  Succeed = 'Succeed',

  /**
   * Processing is terminated but errors occurred
   */
  BadProcessing = 'InvalidValuesFound',

  /**
   * Some invalid values were found at processing beginning
   */
  InvalidValues = 'InvalidValues',

  /**
   * Range of values is invalid
   */
  InvalidMinMax = 'InvalidMinMax',
}

export function isProcessingResult(x: ProcessingResult | any): x is ProcessingResult {
  return x !== null && typeof x === 'object' && 'status' in x;
}
