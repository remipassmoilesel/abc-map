/**
 * Copyright © 2022 Rémi Pace.
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

import { Coordinate } from 'ol/coordinate';

export class GeolocationError extends Event {
  constructor(public readonly error: { message?: string }) {
    super('error');
  }
}

export interface Position {
  accuracy: number | undefined;
  altitude: number | undefined;
  altitudeAccuracy: number | undefined;
  heading: number | undefined;
  speed: number | undefined;
  position: Coordinate | undefined;
  positionLonLat: Coordinate | undefined;
}

export class GeolocationChanged extends Event {
  constructor(public readonly position: Position) {
    super('change');
  }
}
