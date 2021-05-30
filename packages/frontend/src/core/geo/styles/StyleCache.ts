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

import Style from 'ol/style/Style';
import { FeatureStyle } from './FeatureStyle';
import GeometryType from 'ol/geom/GeometryType';

interface CacheEntry {
  key: string;
  style: Style[];
}

export class StyleCache {
  private cache: CacheEntry[] = [];

  public put(geom: GeometryType, properties: FeatureStyle, ratio: number, style: Style[]): void {
    const key = this.cacheKey(geom, properties, ratio);
    this.cache.push({ key: key, style });
  }

  public get(geom: GeometryType, properties: FeatureStyle, ratio: number): Style[] | undefined {
    const key = this.cacheKey(geom, properties, ratio);
    return this.cache.find((entry) => entry.key === key)?.style;
  }

  private cacheKey(geom: GeometryType, properties: FeatureStyle, ratio: number): string {
    return JSON.stringify({ geom, properties, ratio });
  }
}
