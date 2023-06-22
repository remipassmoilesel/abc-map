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
import { Logger } from '@abc-map/shared';
import { isImageTile } from '../../utils/crossContextInstanceof';

export const logger = Logger.get('setTileImage.ts');

export function disableTileImageLogging() {
  logger.disable();
}

export function setTileImage(tile: Tile, blob: Blob) {
  if (!isImageTile(tile)) {
    tile.setState(TileState.ERROR);
    logger.error('Unhandled tile type: ', tile);
    return;
  }
  if (!blob) {
    tile.setState(TileState.ERROR);
    logger.error('Bad blob provided: ', tile);
    return;
  }

  const image = tile.getImage();
  if (image && image instanceof HTMLImageElement) {
    // This is necessary for exports
    image.crossOrigin = 'Anonymous';
    image.src = URL.createObjectURL(blob);
    updateObjectsUrls(image.src);
  } else {
    tile.setState(TileState.ERROR);
    logger.error('Unhandled tile type: ', tile);
  }
}

let maxObjectsUrls = 1000;

export function setMaxObjectsUrl(n: number) {
  maxObjectsUrls = n;
}

const objectsUrls: string[] = [];

function updateObjectsUrls(url: string) {
  objectsUrls.push(url);

  while (objectsUrls.length > maxObjectsUrls) {
    const url = objectsUrls.shift();
    if (url) {
      logger.warn(`Revoking tile URL ${url}`);
      URL.revokeObjectURL(url);
    }
  }
}
