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

import { toContext } from 'ol/render';
import { LineString, Point, Polygon } from 'ol/geom';
import { AbcGeometryType, Logger } from '@abc-map/shared';
import { Style } from 'ol/style';
import { DimensionsPx } from '../../utils/DimensionsPx';
import ImageState from 'ol/ImageState';
import { Type } from 'ol/geom/Geometry';
import ImageStyle from 'ol/style/Image';

const logger = Logger.get('MapSymbolRenderer.ts');

/**
 * This size is applied to every symbol with size that does not matter (all others than point)
 */
export const DefaultSymbolSize: DimensionsPx = { width: 35, height: 35 };

/**
 * This class is used to render map symbols on HTML5 canvas, out of a HTML5 map.
 */
export class MapSymbolRenderer {
  constructor(private olContext = toContext) {}

  /**
   * Return symbol size, or undefined if size is not available yet.
   *
   * @param style
   * @param geom
   * @param styleRatio
   */
  public async symbolSizeForStyle(style: Style, geom: Type | AbcGeometryType, styleRatio: number): Promise<DimensionsPx | undefined> {
    // Points have variable sizes and must keep them in legend
    if (AbcGeometryType.POINT === geom) {
      // Openlayers typings are wrong, entities are nullable
      const image = style.getImage() as ImageStyle | null;
      if (image) {
        await loadImage(image).catch((err) => logger.error('Loading error: ', err));

        const size = image?.getImageSize() as [number, number] | null;
        if (size) {
          return { width: size[0] + 5, height: size[1] + 5 };
        } else {
          logger.debug('Invalid size: ', size);
        }
      } else {
        logger.debug('No image style');
      }
    }
    // Polygon and others does not keep their original sizes
    else {
      return { width: DefaultSymbolSize.width * styleRatio, height: DefaultSymbolSize.height * styleRatio };
    }
  }

  public async renderSymbol(style: Style, geom: Type | AbcGeometryType, canvas: HTMLCanvasElement, styleRatio: number): Promise<void> {
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
    if (AbcGeometryType.POINT === geom || AbcGeometryType.MULTI_POINT === geom) {
      const image = style.getImage() as ImageStyle | null;
      if (image) {
        await loadImage(image).catch((err) => logger.error('Loading error: ', err));
        vectorContext.drawPoint(new Point([centerX, centerY]));
      } else {
        logger.debug('No image style to draw');
      }
    }

    // Polygon rendering
    else if (AbcGeometryType.POLYGON === geom || AbcGeometryType.MULTI_POLYGON === geom) {
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
    else if (AbcGeometryType.LINE_STRING === geom || AbcGeometryType.MULTI_LINE_STRING === geom || AbcGeometryType.LINEAR_RING === geom) {
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

/**
 * Load the style image if necessary. Images are often not ready when we need them.
 *
 * @param image
 */
async function loadImage(image: ImageStyle): Promise<void> {
  if (image.getImageState() !== ImageState.LOADED) {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for image')), 2000);

      const handleImageLoaded = () => {
        image.unlistenImageChange(handleImageLoaded);
        clearTimeout(timeout);
        resolve();
      };

      image.listenImageChange(handleImageLoaded);
      image.load();
    });
  }
}
