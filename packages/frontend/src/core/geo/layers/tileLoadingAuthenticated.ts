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
import { BasicAuthentication, Logger } from '@abc-map/shared';
import ImageTile from 'ol/ImageTile';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import TileState from 'ol/TileState';

export const logger = Logger.get('tileLoadingAuthenticated.ts');

export declare type HttpClientFactory = (config: AxiosRequestConfig) => AxiosInstance;

function defaultHttpClientFactory(config: AxiosRequestConfig): AxiosInstance {
  return axios.create(config);
}

/**
 * Load tiles with basic authentication
 * @param auth
 * @param factory
 */
export function tileLoadingAuthenticated(auth: BasicAuthentication, factory: HttpClientFactory = defaultHttpClientFactory): LoadFunction {
  const authClient = factory({
    timeout: 10_000,
    responseType: 'blob',
    auth: {
      username: auth.username,
      password: auth.password,
    },
  });

  return function (tile, src) {
    if (!(tile instanceof ImageTile)) {
      tile.setState(TileState.ERROR);
      logger.error('Unhandled tile type: ', tile);
      return;
    }

    authClient
      .get(src)
      .then((res) => {
        const blob = res.data as Blob;
        const image = tile.getImage();
        if (image && image instanceof HTMLImageElement) {
          // This is necessary for exports
          image.crossOrigin = 'Anonymous';
          image.src = URL.createObjectURL(blob);
        } else {
          tile.setState(TileState.ERROR);
          logger.error('Unhandled tile type: ', tile);
        }
      })
      .catch((err) => {
        tile.setState(TileState.ERROR);
        logger.error(err);
      });
  };
}
