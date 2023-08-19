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

import { BlobIO } from './BlobIO';

describe('BlobIO', () => {
  it('asString()', async () => {
    const blob = new Blob(['abcdef']);
    expect(await BlobIO.asString(blob)).toEqual('abcdef');
  });

  it('asArrayBuffer()', async () => {
    const array = new Uint8Array([1, 2, 3]);
    const buffer = new Blob([array]);
    const result = new DataView(await BlobIO.asArrayBuffer(buffer));
    expect(result.getUint8(0)).toEqual(array[0]);
    expect(result.getUint8(1)).toEqual(array[1]);
    expect(result.getUint8(2)).toEqual(array[2]);
  });
});
