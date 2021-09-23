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
import { ImageTile } from 'ol';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import TileState from 'ol/TileState';

export const logger = Logger.get('tileLoadingPublic.ts');

export declare type HttpClientFactory = (config: AxiosRequestConfig) => AxiosInstance;

function defaultHttpClientFactory(config: AxiosRequestConfig): AxiosInstance {
  return axios.create(config);
}

export function tileLoadingPublic(factory: HttpClientFactory = defaultHttpClientFactory): LoadFunction {
  const publicCLient = factory({ timeout: 10_000, responseType: 'blob' });

  return function (_tile, src) {
    const tile: ImageTile = _tile as ImageTile;
    publicCLient
      .get(src)
      .then((res) => {
        const blob = res.data as Blob;
        if (tile.getImage && tile.getImage() instanceof HTMLImageElement) {
          const image = tile.getImage() as HTMLImageElement;
          image.crossOrigin = 'Anonymous';
          image.src = URL.createObjectURL(blob);
        } else {
          tile.setState(TileState.ERROR);
          logger.error('Unhandled tile: ', tile);
        }
      })
      .catch((err) => {
        tile.setState(TileState.ERROR);
        logger.error(err);
      });
  };
}
