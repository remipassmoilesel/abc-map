import { AbcLayout, LayoutFormat } from '@abc-map/shared-entities';

export interface Dimension {
  width: number;
  height: number;
}

export class LayoutHelper {
  public static readonly DPI = 25.4;
  public static readonly PRINT_RESOLUTION = 200;

  public static layoutToPixel(layout: AbcLayout): Dimension {
    return this.formatToPixel(layout.format);
  }

  public static formatToPixel(format: LayoutFormat): Dimension {
    const width = Math.round((format.width * LayoutHelper.PRINT_RESOLUTION) / LayoutHelper.DPI);
    const height = Math.round((format.height * LayoutHelper.PRINT_RESOLUTION) / LayoutHelper.DPI);
    return { width, height };
  }
}
