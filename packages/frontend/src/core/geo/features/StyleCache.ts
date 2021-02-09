import Style from 'ol/style/Style';
import { AbcStyle } from './AbcStyle';

interface CacheEntry {
  key: string;
  style: Style | Style[];
}

export class StyleCache {
  private cache: CacheEntry[] = [];

  public put(properties: AbcStyle, style: Style | Style[]): void {
    const key = this.keyFromProps(properties);
    this.cache.push({ key: key, style });
  }

  public get(properties: AbcStyle): Style | Style[] | undefined {
    const key = this.keyFromProps(properties);
    return this.cache.find((entry) => entry.key === key)?.style;
  }

  private keyFromProps(properties: AbcStyle): string {
    const stroke = properties.stroke;
    const fill = properties.fill;
    return `${stroke.width}:${stroke.color}:${fill.color}`;
  }
}
