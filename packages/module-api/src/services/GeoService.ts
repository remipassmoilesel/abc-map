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

import { MapWrapper } from '../map/MapWrapper';
import { FeatureStyle } from '../features/FeatureStyle';
import { FeatureWrapper } from '../features/FeatureWrapper';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';

export declare type StyleTransformFunc = (x: FeatureStyle, f: FeatureWrapper) => FeatureStyle | undefined;

export interface GeoService {
  getMainMap(): MapWrapper;
  getUserPosition(): Promise<Coordinate>;
  updateSelectedFeatures(transform: StyleTransformFunc): number;
  geocode(query: string): Promise<NominatimResult[]>;
  loadProjection(code: string): Promise<Extent>;
}

export interface NominatimResult {
  /**
   * minY, maxY, minX, maxX
   */
  boundingbox: [string, string, string, string];
  class: string;
  display_name: string;
  icon: string;
  importance: number;
  lat: string;
  lon: string;
  licence: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
  type: string;
}
