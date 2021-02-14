import Style from 'ol/style/Style';
import { AbcStyleProperties } from './AbcStyleProperties';
import * as objectHash from 'object-hash';

interface CacheEntry {
  key: string;
  style: Style | Style[];
}

export class StyleCache {
  private cache: CacheEntry[] = [];

  public put(properties: AbcStyleProperties, style: Style | Style[]): void {
    const key = this.keyFromProps(properties);
    this.cache.push({ key: key, style });
  }

  public get(properties: AbcStyleProperties): Style | Style[] | undefined {
    const key = this.keyFromProps(properties);
    return this.cache.find((entry) => entry.key === key)?.style;
  }

  private keyFromProps(properties: AbcStyleProperties): string {
    return objectHash.sha1(properties);
  }
}
