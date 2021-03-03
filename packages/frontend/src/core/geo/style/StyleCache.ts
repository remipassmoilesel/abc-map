import Style from 'ol/style/Style';
import { FeatureStyle } from './FeatureStyle';
import * as objectHash from 'object-hash';
import GeometryType from 'ol/geom/GeometryType';

interface CacheEntry {
  key: string;
  style: Style[];
}

export class StyleCache {
  private cache: CacheEntry[] = [];

  public put(geom: GeometryType, properties: FeatureStyle, style: Style[]): void {
    const key = this.cacheKey(geom, properties);
    this.cache.push({ key: key, style });
  }

  public get(geom: GeometryType, properties: FeatureStyle): Style[] | undefined {
    const key = this.cacheKey(geom, properties);
    return this.cache.find((entry) => entry.key === key)?.style;
  }

  private cacheKey(geom: GeometryType, properties: FeatureStyle): string {
    return objectHash.sha1({ geom, properties });
  }
}
