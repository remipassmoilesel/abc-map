import { AbcProjection } from '../AbcProjection';

export interface AbcLayout {
  id: string;
  name: string;
  format: LayoutFormat;
  view: AbcLayoutView;
}

export interface LayoutFormat {
  name: string;
  /**
   * In millimeters
   */
  width: number;
  /**
   * In millimeters
   */
  height: number;
  orientation: 'portrait' | 'landscape';
}

export class LayoutFormats {
  public static readonly A5_PORTRAIT: LayoutFormat = {
    name: 'A5 Portrait',
    width: 148,
    height: 210,
    orientation: 'portrait',
  };

  public static readonly A5_LANDSCAPE: LayoutFormat = {
    name: 'A5 Paysage',
    width: 210,
    height: 148,
    orientation: 'landscape',
  };

  public static readonly A4_PORTRAIT: LayoutFormat = {
    name: 'A4 Portrait',
    width: 210,
    height: 297,
    orientation: 'portrait',
  };

  public static readonly A4_LANDSCAPE: LayoutFormat = {
    name: 'A4 Paysage',
    width: 297,
    height: 210,
    orientation: 'landscape',
  };

  public static readonly A3_PORTRAIT: LayoutFormat = {
    name: 'A3 Portrait',
    width: 297,
    height: 420,
    orientation: 'portrait',
  };

  public static readonly A3_LANDSCAPE: LayoutFormat = {
    name: 'A3 Paysage',
    width: 420,
    height: 297,
    orientation: 'landscape',
  };

  public static ALL: LayoutFormat[] = [
    LayoutFormats.A5_PORTRAIT,
    LayoutFormats.A5_LANDSCAPE,
    LayoutFormats.A4_PORTRAIT,
    LayoutFormats.A4_LANDSCAPE,
    LayoutFormats.A3_PORTRAIT,
    LayoutFormats.A3_LANDSCAPE,
  ];
}

export interface AbcLayoutView {
  center: number[];
  resolution: number;
  projection: AbcProjection;
}
