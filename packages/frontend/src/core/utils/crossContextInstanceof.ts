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
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { Projection } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorImageLayer from 'ol/layer/VectorImage';
import TileSource from 'ol/source/Tile';
import VectorSource from 'ol/source/Vector';
import ImageTile from 'ol/ImageTile';
import Map from 'ol/Map';

// Sometimes we cannot use instanceof, per example if there are several global scopes (different frames / modules)
export function crossContextInstanceof<T extends object>(obj: unknown, properties: string[]): obj is T {
  const isNonNullObject = !obj || typeof obj !== 'object';
  if (isNonNullObject) {
    return false;
  }

  const hasMissingProperty = properties.find((prop) => !(prop in obj));
  return !hasMissingProperty;
}

export function isOpenlayersFeature(obj: unknown): obj is Feature {
  return crossContextInstanceof(obj, ['getId', 'getGeometry', 'getGeometryName', 'getStyle', 'getStyleFunction']);
}

export function isOpenlayersGeometry(obj: unknown): obj is Geometry {
  return crossContextInstanceof(obj, [
    'containsXY',
    'getClosestPoint',
    'intersectsCoordinate',
    'getExtent',
    'rotate',
    'scale',
    'simplify',
    'getType',
    'applyTransform',
    'intersectsExtent',
    'translate',
  ]);
}

export function isOpenlayersProjection(obj: unknown): obj is Projection {
  return crossContextInstanceof(obj, ['canWrapX', 'getCode', 'getExtent', 'getUnits', 'getMetersPerUnit', 'getWorldExtent', 'getAxisOrientation']);
}

export function isTileLayer(obj: unknown): obj is TileLayer<TileSource> {
  return crossContextInstanceof(obj, ['createRenderer', 'getPreload', 'setPreload', 'getUseInterimTilesOnError', 'setUseInterimTilesOnError']);
}

export function isVectorImageLayer(obj: unknown): obj is VectorImageLayer<VectorSource> {
  return crossContextInstanceof(obj, [
    'getImageRatio',
    'createRenderer',
    'getDeclutter',
    'getRenderBuffer',
    'getRenderOrder',
    'getStyle',
    'getStyleFunction',
    'getUpdateWhileAnimating',
  ]);
}

export function isImageTile(obj: unknown): obj is ImageTile {
  return crossContextInstanceof(obj, ['getImage', 'setImage', 'getKey', 'getInterimTile', 'refreshInterimChain', 'getTileCoord', 'getState']);
}

export function isOpenlayersMap(obj: unknown): obj is Map {
  return crossContextInstanceof(obj, ['createRenderer', 'addControl', 'addInteraction', 'addLayer', 'addOverlay']);
}

export function isTileSource(obj: unknown): obj is TileSource {
  return crossContextInstanceof(obj, [
    'getResolutions',
    'getTile',
    'getTileGrid',
    'getTileGridForProjection',
    'getTileCacheForProjection',
    'getTilePixelRatio',
    'getTilePixelSize',
    'getTileCoordForTileUrlFunction',
  ]);
}
