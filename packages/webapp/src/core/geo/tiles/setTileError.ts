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

import { Tile } from 'ol';
import TileState from 'ol/TileState';
import { errorMessage, Logger } from '@abc-map/shared';
import { AxiosError } from 'axios';

const logger = Logger.get('setTileError.ts');

export function setTileError(tile: Tile, err: Error | AxiosError | undefined) {
  // If no extent is set, this function can be called to load tiles that does not exist
  const hasStatus = err && 'response' in err && err.response?.status === 404;
  const messageMatch404 = errorMessage(err).includes('404');
  if (hasStatus || messageMatch404) {
    tile.setState(TileState.EMPTY);
  } else {
    tile.setState(TileState.ERROR);
  }
}
