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

import { LoadFunction } from 'ol/Tile';
import { BasicAuthentication, Logger } from '@abc-map/shared';
import axios, { AxiosError } from 'axios';
import { setTileImage } from './setTileImage';
import { setTileError } from './setTileError';
import { TileStorage } from '../../storage/indexed-db/tiles/TileIDBStorage';
import { CURRENT_VERSION } from '../../storage/indexed-db/tiles/TileIDBEntry';

export const logger = Logger.get('tileLoadingAuthenticated.ts');

/**
 * Load tiles with basic authentication
 * @param auth
 */
export function tileLoadingAuthenticated(auth: BasicAuthentication): LoadFunction {
  const httpClient = axios.create({
    timeout: 10_000,
    responseType: 'blob',
    auth: {
      username: auth.username,
      password: auth.password,
    },
  });

  return async function (tile, src) {
    const storage = await TileStorage.get();

    storage
      .get(src)
      .then<Blob>((tile) => {
        if (!tile) {
          return httpClient.get(src).then((res) => res.data);
        }
        return tile;
      })
      .then((image) => {
        setTileImage(tile, image);
        return storage.put({ version: CURRENT_VERSION, url: src, image });
      })
      .catch((err: Error | AxiosError | undefined) => {
        logger.error('Cannot load tile: ', err);
        setTileError(tile, err);
      });
  };
}
