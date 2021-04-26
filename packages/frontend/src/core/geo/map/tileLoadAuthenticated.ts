import { LoadFunction } from 'ol/Tile';
import { WmsAuthentication } from '@abc-map/shared-entities';
import { Logger } from '@abc-map/frontend-commons';
import { ImageTile } from 'ol';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import TileState from 'ol/TileState';

export const logger = Logger.get('tileLoadFunction.ts');

export declare type HttpClientFactory = (config: AxiosRequestConfig) => AxiosInstance;

function defaultHttpClientFactory(config: AxiosRequestConfig): AxiosInstance {
  return axios.create(config);
}

export function tileLoadAuthenticated(auth: WmsAuthentication, factory: HttpClientFactory = defaultHttpClientFactory): LoadFunction {
  const authClient = factory({
    timeout: 10_000,
    responseType: 'blob',
    auth: {
      username: auth.username,
      password: auth.password,
    },
  });

  return function (_tile, src) {
    const tile: ImageTile = _tile as ImageTile;
    authClient
      .get(src)
      .then((res) => {
        const blob = res.data as Blob;
        if (tile.getImage && tile.getImage() instanceof HTMLImageElement) {
          const image = tile.getImage() as HTMLImageElement;
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
