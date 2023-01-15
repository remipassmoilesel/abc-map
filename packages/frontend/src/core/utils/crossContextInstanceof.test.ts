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

import {
  crossContextInstanceof,
  isOpenlayersGeometry,
  isOpenlayersFeature,
  isOpenlayersProjection,
  isTileLayer,
  isVectorImageLayer,
  isImageTile,
  isOpenlayersMap,
  isTileSource,
} from './crossContextInstanceof';
import { FeatureWrapper } from '../geo/features/FeatureWrapper';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { Projection } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorImageLayer from 'ol/layer/VectorImage';
import ImageTile from 'ol/ImageTile';
import Map from 'ol/Map';
import { OSM } from 'ol/source';

describe('crossContextInstanceof', function () {
  it('should return false', () => {
    crossContextInstanceof(null, ['getGeometry']);
    crossContextInstanceof(undefined, ['getGeometry']);
  });

  it('should return true', () => {
    crossContextInstanceof(FeatureWrapper.create(new Point([1, 1])).unwrap(), ['getGeometry']);
  });

  it('isOpenlayersFeature()', () => {
    expect(isOpenlayersFeature(null)).toBe(false);
    expect(isOpenlayersFeature({})).toBe(false);
    expect(isOpenlayersFeature(new Geometry())).toBe(false);

    expect(isOpenlayersFeature(new Feature())).toBe(true);
  });

  it('isOpenlayerGeometry()', () => {
    expect(isOpenlayersGeometry(null)).toBe(false);
    expect(isOpenlayersGeometry({})).toBe(false);
    expect(isOpenlayersGeometry(new Feature())).toBe(false);

    expect(isOpenlayersGeometry(new Geometry())).toBe(true);
  });

  it('isOpenlayersProjection()', () => {
    expect(isOpenlayersProjection(null)).toBe(false);
    expect(isOpenlayersProjection({})).toBe(false);
    expect(isOpenlayersProjection(new Feature())).toBe(false);

    expect(isOpenlayersProjection(new Projection({ code: 'EPSG:3857' }))).toBe(true);
  });

  it('isTileLayer()', () => {
    expect(isTileLayer(new Feature())).toBe(false);

    expect(isTileLayer(new TileLayer())).toBe(true);
  });

  it('isVectorImageLayer()', () => {
    expect(isVectorImageLayer(new Feature())).toBe(false);

    expect(isVectorImageLayer(new VectorImageLayer())).toBe(true);
  });

  it('isImageTile()', () => {
    expect(isImageTile(new Feature())).toBe(false);

    expect(isImageTile(new ImageTile([7, 8], null, 'nowhere.net', null, () => undefined))).toBe(true);
  });

  it('isOpenlayersMap()', () => {
    expect(isOpenlayersMap(new Feature())).toBe(false);

    expect(isOpenlayersMap(new Map({}))).toBe(true);
  });

  it('isTileSource()', () => {
    expect(isTileSource(new Feature())).toBe(false);

    expect(isTileSource(new OSM())).toBe(true);
  });
});
