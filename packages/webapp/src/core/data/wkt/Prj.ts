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

export interface Prj {
  original: string;
  wkt: PrjWkt;
}

// TODO: improve typings
export interface PrjWkt {
  type: 'PROJCS';
  name: string;
  projName: string;
  srsCode: string;
  GEOGCS?: any;
  latitude_of_center?: number;
  longitude_of_center?: number;
  false_easting?: number;
  false_northing?: number;
  axis?: string;
  units?: string;
  to_meter?: 1;
  datumCode?: string;
  ellps?: string;
  a?: number;
  rf?: number;
  lat0?: number;
  longc?: number;
  x0?: number;
  y0?: number;
  long0?: number;
  UNIT?: any;
  PROJECTION?: string;
  AUTHORITY?: { EPSG: string };
  AXIS?: any;
}
