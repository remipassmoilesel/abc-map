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

import { LoadFunction } from 'ol/Tile';
import { Logger } from '@abc-map/shared';
import axios, { AxiosError } from 'axios';
import { TileStorage } from '../../storage/project-storage/TileDbStorage';
import { setTileImage } from './setTileImage';
import { setTileError } from './setTileError';

export const logger = Logger.get('tileLoadingPublic.ts');

export function tileLoadingPublic(): LoadFunction {
  const httpClient = axios.create({ timeout: 10_000, responseType: 'blob' });

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
        return storage.put({ url: src, image });
      })
      .catch((err: Error | AxiosError | undefined) => {
        logger.error('Cannot load tile: ', err);
        setTileError(tile, err);
      });
  };
}
