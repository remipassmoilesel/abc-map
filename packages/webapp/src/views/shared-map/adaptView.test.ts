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

import { adaptView } from './adaptView';
import { AbcView } from '@abc-map/shared';
import { TestHelper } from '../../core/utils/test/TestHelper';

describe('adaptView()', () => {
  let originalView: AbcView;
  beforeEach(() => {
    TestHelper.fakeAppViewport(888, 666);

    originalView = {
      resolution: 10_000,
      center: [123, 456],
      projection: { name: 'EPSG:4326' },
      rotation: 0,
    };
  });

  it('should do nothing if viewport is big enought', () => {
    const view = adaptView(originalView, false, { width: 800, height: 600 });
    expect(view).toEqual(originalView);
  });

  it('should adapt if viewport is small', () => {
    const view = adaptView(originalView, false, { width: 8000, height: 6000 });
    expect(view).toEqual({ ...originalView, resolution: 90090.09009009 });
  });
});
