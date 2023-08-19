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

/* eslint-disable no-template-curly-in-string */

import { variableExpansion } from './variableExpansion';

describe('variableExpansion()', () => {
  it('should expand', () => {
    const variables = {
      var1: 'val1',
      var2: 'val2',
      var3: 'val3',
    };

    const source = 'http://${var1}.domain.net/${var1}/${var2}';

    expect(variableExpansion(source, variables)).toEqual('http://val1.domain.net/val1/val2');
  });
});
