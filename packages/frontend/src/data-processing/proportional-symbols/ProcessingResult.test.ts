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

import { isProcessingResult, ProcessingResult, Status } from './ProcessingResult';

describe('ProcessingResult', () => {
  it('isProcessingResult()', () => {
    expect(isProcessingResult(undefined)).toEqual(false);
    expect(isProcessingResult(null)).toEqual(false);
    expect(isProcessingResult({})).toEqual(false);

    const result: ProcessingResult = {
      status: Status.Succeed,
      featuresProcessed: 0,
      invalidFeatures: 0,
      invalidValues: [],
      missingDataRows: [],
    };
    expect(isProcessingResult(result)).toEqual(true);
  });
});
