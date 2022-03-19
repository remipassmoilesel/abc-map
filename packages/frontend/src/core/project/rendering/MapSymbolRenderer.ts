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

import { toContext } from 'ol/render';
import { LineString, Point, Polygon } from 'ol/geom';
import { GeometryType, Logger } from '@abc-map/shared';
import { Style } from 'ol/style';
import { StyleFactory } from '../../geo/styles/StyleFactory';
import { DimensionsPx } from '../../utils/DimensionsPx';
import ImageState from 'ol/ImageState';

const logger = Logger.get('MapSymbolRenderer.ts');

/**
 * This size is applied to every symbol with size that does not matter (all others than point)
 */
export const DefaultSymbolSize: DimensionsPx = { width: 35, height: 35 };

export class MapSymbolRenderer {
  private readonly borderWidth = 3;

  constructor(private styleFactory = StyleFactory.get(), private olContext = toContext) {}

  public symbolSizeForStyle(style: Style, geom: GeometryType, styleRatio: number): DimensionsPx {
    // Points have variable sizes and must keep them in legend
    if (GeometryType.POINT === geom) {
      const size = style.getImage().getImageSize();
      return { width: size[0] + 5, height: size[1] + 5 };
    }
    // Polygon and others does not keep their original sizes
    else {
      return { width: DefaultSymbolSize.width * styleRatio, height: DefaultSymbolSize.height * styleRatio };
    }
  }

  public async renderSymbol(style: Style, geom: GeometryType, canvas: HTMLCanvasElement, styleRatio: number): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      logger.error('Cannot render legend, invalid context');
      return;
    }

    const margin = 5 * styleRatio;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);

    // Pixel ratio = 1 is necessary for mobile devices
    const vectorContext = this.olContext(ctx, { pixelRatio: 1, size: [canvas.width, canvas.height] });
    vectorContext.setStyle(style);

    // Point rendering
    if (GeometryType.POINT === geom || GeometryType.MULTI_POINT === geom) {
      // Style is image, and not loaded yet. Rendering is async 🤷
      const image = style.getImage();
      if (image && image.getImageState() !== ImageState.LOADED) {
        return new Promise<void>((resolve) => {
          const draw = () => {
            vectorContext.drawPoint(new Point([centerX, centerY]));
            image.unlistenImageChange(draw);
            resolve();
          };
          image.listenImageChange(draw);
          image.load();
        });
      }
      // Style is not image, or already loaded
      else {
        vectorContext.drawPoint(new Point([centerX, centerY]));
      }
    }

    // Polygon rendering
    else if (GeometryType.POLYGON === geom || GeometryType.MULTI_POLYGON === geom) {
      const polygon = new Polygon([
        [
          [margin, margin],
          [width - margin, margin],
          [width - margin, height - margin],
          [margin, height - margin],
          [margin, margin],
        ],
      ]);
      vectorContext.drawPolygon(polygon);
    }

    // Line rendering
    else if (GeometryType.LINE_STRING === geom || GeometryType.MULTI_LINE_STRING === geom || GeometryType.LINEAR_RING === geom) {
      const line = new LineString([
        [margin, margin],
        [width - margin, margin],
        [margin, height - margin],
        [width - margin, height - margin],
      ]);
      vectorContext.drawLineString(line);
    }

    // Unhandled shape
    else {
      logger.error(`Unhandled geometry type for legend rendering: ${geom}`, { style, geom });
    }
  }
}
