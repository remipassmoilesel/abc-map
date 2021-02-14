import { FillPatterns } from '@abc-map/shared-entities';

export interface AbcStyleProperties {
  stroke: StrokeProperties;
  fill: FillProperties;
}

export interface StrokeProperties {
  color?: string;
  width?: number;
}

export interface FillProperties {
  /**
   * Color1 is the main color of fill.
   */
  color1?: string;
  /**
   * Color2 can be used for patterns (e.g: color of circles)
   */
  color2?: string;
  /**
   * Type of pattern, Flat by default
   */
  pattern?: FillPatterns;
}
