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
import { AbcGeometryType, FeatureStyle } from '@abc-map/shared';
import { nanoid } from 'nanoid';
import { StyleFactoryOptions } from './StyleFactoryOptions';

export interface StyleCacheEntry {
  id: string;
  style: Style;
  geomType: AbcGeometryType;
  options: StyleFactoryOptions;
  properties: FeatureStyle;
}

export class StyleCache {
  private cache = new Map<string, StyleCacheEntry>();

  public put(geomType: AbcGeometryType, properties: FeatureStyle, options: StyleFactoryOptions, style: Style): void {
    const key = this.cacheKey(geomType, properties, options);
    const entry = {
      id: nanoid(),
      geomType,
      properties,
      options,
      style,
    };
    this.cache.set(key, entry);
  }

  public get(geom: AbcGeometryType, properties: FeatureStyle, options: StyleFactoryOptions): Style | undefined {
    const key = this.cacheKey(geom, properties, options);
    return this.cache.get(key)?.style;
  }

  public getAll(): StyleCacheEntry[] {
    return Array.from(this.cache.values());
  }

  public clear() {
    this.cache.clear();
  }

  private cacheKey(geomType: AbcGeometryType, properties: FeatureStyle, options: StyleFactoryOptions): string {
    const key = { geomType, properties, options };
    return JSON.stringify(key);
  }
}
