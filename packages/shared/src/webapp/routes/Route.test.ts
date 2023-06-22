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

import { Params, Route } from './Route';
import { Language } from '../../lang';

interface TestParams extends Params {
  param1: string;
  param2?: string;
}

describe('Route', () => {
  let route: Route<TestParams>;
  beforeEach(() => {
    route = new Route<TestParams>('/:lang/sample/route/:param1/:param2?/:param3?/', () => Language.English);
  });

  it('raw()', () => {
    expect(route.raw()).toEqual('/:lang/sample/route/:param1/:param2?/:param3?/');
  });

  it('format()', () => {
    expect(route.format()).toEqual('/en/sample/route/:param1/');
  });

  it('withParams() should replace params', () => {
    const actual = route.withParams({ param1: 'value1', param2: 'value2' });
    expect(actual).toEqual('/en/sample/route/value1/value2/:param3?/');
  });
});
