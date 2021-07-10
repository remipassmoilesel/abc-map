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
import { AbcLegend, GeometryType, LegendDisplay, Logger } from '@abc-map/shared';
import { Style } from 'ol/style';
import { StyleFactory } from '../styles/StyleFactory';
import { DefaultSymbolSize } from './constants';
import { DimensionsPx } from '../../utils/DimensionsPx';
import ImageState from 'ol/ImageState';
import { CanvasHelper } from '../../utils/CanvasHelper';
import { Position } from '../../utils/Position';

const logger = Logger.get('LegendRenderer.ts');

export class LegendRenderer {
  private readonly borderWidth = 3;

  constructor(private styleFactory = StyleFactory.get(), private olContext = toContext) {}

  public symbolSizeForStyle(style: Style, geom: GeometryType) {
    if (GeometryType.POINT === geom) {
      const size = style.getImage().getImageSize();
      return { width: size[0] + 5, height: size[1] + 5 };
    } else {
      return DefaultSymbolSize;
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
    const centerX = width / 2;
    const centerY = height / 2;

    const vectorContext = this.olContext(ctx, { size: [canvas.width, canvas.height] });
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

  public async renderLegend(legend: AbcLegend, canvas: HTMLCanvasElement, styleRatio: number) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      logger.error('Cannot render legend, invalid canvas context');
      return;
    }

    const symbolCanvas = document.createElement('canvas');

    // First we iterate all items in order to get the max width of symbols
    let maxSymbolWidth = 0;
    for (const item of legend.items) {
      if (!item.symbol) {
        continue;
      }

      const style = this.styleFactory.getForProperties(item.symbol.properties, item.symbol.geomType, styleRatio);
      const symbolSize = this.symbolSizeForStyle(style, item.symbol.geomType);
      if (maxSymbolWidth < symbolSize.width) {
        maxSymbolWidth = symbolSize.width;
      }
    }

    // We clean draw area
    const borderWidth = this.borderWidth * styleRatio;
    ctx.lineWidth = borderWidth;
    CanvasHelper.roundedRectangle(ctx, borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth, 7, '#0077b6', 'white');

    // We iterate items
    const fontSize = 20 * styleRatio;
    const lineMargin = fontSize * 0.9;
    const symbolMargin = fontSize * 0.5;
    const x = fontSize * 0.5;
    let y = fontSize * 0.5 + fontSize;
    for (const item of legend.items) {
      let symbolSize: DimensionsPx = { width: 0, height: 0 };

      // We draw symbol if any
      if (item.symbol) {
        const style = this.styleFactory.getForProperties(item.symbol.properties, item.symbol.geomType, styleRatio);

        symbolSize = this.symbolSizeForStyle(style, item.symbol.geomType);
        symbolCanvas.width = symbolSize.width;
        symbolCanvas.height = symbolSize.height;
        symbolCanvas.getContext('2d')?.clearRect(0, 0, symbolSize.width, symbolSize.height);

        await this.renderSymbol(style, item.symbol.geomType, symbolCanvas, styleRatio);

        const symbolX = x + (maxSymbolWidth / 2 - symbolSize.width / 2);
        ctx.drawImage(symbolCanvas, symbolX, y);
      }

      // We draw text
      const textX = x + maxSymbolWidth + symbolMargin;
      const textY = y + symbolSize.height / 2 + fontSize / 3; // 3 because fonts are smaller than their heights 🤪
      ctx.fillStyle = 'black';
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillText(item.text, textX, textY);

      y += Math.max(symbolSize.height, fontSize) + lineMargin;
    }
  }

  public setPreviewStyle(legend: AbcLegend, legendCanvas: HTMLCanvasElement) {
    legendCanvas.style.position = 'absolute';
    switch (legend.display) {
      case LegendDisplay.Hidden:
        legendCanvas.style.display = 'none';
        break;
      case LegendDisplay.UpperLeftCorner:
        legendCanvas.style.display = 'block';
        legendCanvas.style.top = '0';
        legendCanvas.style.right = '';
        legendCanvas.style.bottom = '';
        legendCanvas.style.left = '0';
        break;
      case LegendDisplay.UpperRightCorner:
        legendCanvas.style.display = 'block';
        legendCanvas.style.top = '0';
        legendCanvas.style.right = '0';
        legendCanvas.style.bottom = '';
        legendCanvas.style.left = '';
        break;
      case LegendDisplay.BottomRightCorner:
        legendCanvas.style.display = 'block';
        legendCanvas.style.top = '';
        legendCanvas.style.right = '0';
        legendCanvas.style.bottom = '0';
        legendCanvas.style.left = '';
        break;
      case LegendDisplay.BottomLeftCorner:
        legendCanvas.style.display = 'block';
        legendCanvas.style.top = '';
        legendCanvas.style.right = '';
        legendCanvas.style.bottom = '0';
        legendCanvas.style.left = '0';
        break;
      default:
        logger.error('Unhandled legend display: ', { legend, display: legend.display });
    }
  }

  public getLegendPosition(legend: AbcLegend, legendCv: HTMLCanvasElement, exportCv: HTMLCanvasElement): Position | undefined {
    switch (legend.display) {
      case LegendDisplay.Hidden:
        // If hidden we render it out of map
        return { x: exportCv.width + 10, y: exportCv.height + 10 };
      case LegendDisplay.UpperLeftCorner:
        return { x: 0, y: 0 };
      case LegendDisplay.UpperRightCorner:
        return { x: exportCv.width - legendCv.width, y: 0 };
      case LegendDisplay.BottomRightCorner:
        return { x: exportCv.width - legendCv.width, y: exportCv.height - legendCv.height };
      case LegendDisplay.BottomLeftCorner:
        return { x: 0, y: exportCv.height - legendCv.height };
    }
  }
}
