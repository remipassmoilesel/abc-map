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

import { routeReplace } from './routeReplace';

describe('routeReplace', () => {
  it('should replace nothing', () => {
    const actual = routeReplace('/sample/route/:param', {});
    expect(actual).toEqual('/sample/route/:param');
  });

  it('should replace nothing', () => {
    const param = undefined;
    const actual = routeReplace('/sample/route/:param', { param });
    expect(actual).toEqual('/sample/route/:param');
  });

  it('should replace params', () => {
    const actual = routeReplace('/sample/route/:param1/:param2', { param1: 'value1', param2: 'value2' });
    expect(actual).toEqual('/sample/route/value1/value2');
  });

  it('should replace param', () => {
    const actual = routeReplace('/sample/route/:param1', { param1: '' });
    expect(actual).toEqual('/sample/route/');
  });

  it('should replace optional param', () => {
    const actual = routeReplace('/sample/route/:param1?', { param1: '' });
    expect(actual).toEqual('/sample/route/');
  });
});
