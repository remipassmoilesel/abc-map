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

import { projectionCodeFromName, isProjectionEqual, normalizedProjectionName } from './AbcProjection';

describe('AbcProjection', () => {
  it('normalizedProjectionName()', () => {
    expect(normalizedProjectionName('  urn:ogc:def:crs:epsg:5326  ')).toEqual('EPSG:5326');
    expect(normalizedProjectionName('  urn:ogc:def:crs:crs:84  ')).toEqual('CRS:84');
    expect(normalizedProjectionName('  urn:ogc:def:crs:EPSG::4326  ')).toEqual('EPSG:4326');
    expect(normalizedProjectionName('  projections/EPSG::4326.json  ')).toEqual('EPSG:4326');
    expect(normalizedProjectionName('  bla bla ')).toBeUndefined();
  });

  it('projectionCodeFromName()', () => {
    expect(projectionCodeFromName('  urn:ogc:def:crs:epsg:5326  ')).toEqual('5326');
    expect(projectionCodeFromName('  bla bla ')).toBeUndefined();
  });

  it('isProjectionEqual()', () => {
    expect(isProjectionEqual('  urn:ogc:def:crs:epsg:5326  ', 'EPSG:5326 ')).toEqual(true);
    expect(isProjectionEqual('  urn:ogc:def:crs:epsg:5327  ', 'EPSG:5326 ')).toEqual(false);
    expect(isProjectionEqual('  urn:ogc:def:crs:epsg:5327 ', '  bla bla ')).toEqual(false);
    expect(isProjectionEqual('  bla bla ', '  bla bla ')).toEqual(false);
  });
});
