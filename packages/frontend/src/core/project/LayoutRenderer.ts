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

import { MapWrapper } from '../geo/map/MapWrapper';
import { LayoutHelper } from './LayoutHelper';
import View from 'ol/View';
import { AbcLegend, BlobIO, Logger } from '@abc-map/shared';
import { AbcFile, AbcLayout, Zipper } from '@abc-map/shared';
import { MapFactory } from '../geo/map/MapFactory';
import { jsPDF } from 'jspdf';
import { LegendRenderer } from '../geo/legend/LegendRenderer';

export const logger = Logger.get('LayoutRenderer');

// TODO: test, find a way to trigger openlayers renders with jest

export class LayoutRenderer {
  private support?: HTMLDivElement;
  private map?: MapWrapper;
  private legendCanvas?: HTMLCanvasElement;
  private legendRenderer = new LegendRenderer();

  public init(support: HTMLDivElement) {
    // Initialize map
    this.support = support;
    this.map = MapFactory.createNaked();
    this.map.setTarget(support);

    // Initialize legend
    this.legendCanvas = document.createElement('canvas');
  }

  public dispose() {
    this.map?.dispose();
  }

  public async renderLayoutsAsPdf(layouts: AbcLayout[], legend: AbcLegend, sourceMap: MapWrapper): Promise<Blob> {
    const pdf = new jsPDF();

    // jsPDF create a first page that may not correspond to first layout
    pdf.deletePage(1);

    for (const layout of layouts) {
      const format = layout.format;
      pdf.addPage([format.width, format.height], format.orientation);

      const canvas = await this.renderLayout(layout, legend, sourceMap);
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, layout.format.width, layout.format.height);
    }

    return pdf.output('blob');
  }

  public async renderLayoutsAsPng(layouts: AbcLayout[], legend: AbcLegend, sourceMap: MapWrapper): Promise<Blob> {
    const files: AbcFile<Blob>[] = [];
    for (const layout of layouts) {
      const canvas = await this.renderLayout(layout, legend, sourceMap);
      const image = await BlobIO.canvasToPng(canvas);
      files.push({ path: layout.name, content: image });
    }

    return Zipper.forFrontend().zipFiles(files);
  }

  private renderLayout(layout: AbcLayout, legend: AbcLegend, sourceMap: MapWrapper): Promise<HTMLCanvasElement> {
    logger.info('Rendering layout: ', layout);
    const support = this.support;
    const renderingMap = this.map;
    const legendCanvas = this.legendCanvas;
    if (!renderingMap || !support || !legendCanvas) {
      throw new Error('You must call init() before rendering');
    }

    // Adapt size of map to layout
    const dimension = LayoutHelper.formatToPixel(layout.format);
    support.style.marginTop = '200px';
    support.style.width = `${dimension.width}px`;
    support.style.height = `${dimension.height}px`;
    renderingMap.unwrap().setSize([dimension.width, dimension.height]);

    const styleRatio = LayoutHelper.styleRatio(dimension.width, dimension.height);

    // Copy layers from sourceMap to exportMap
    renderingMap.unwrap().getLayers().clear();
    sourceMap.getLayers().forEach((lay) => renderingMap.addLayer(lay.shallowClone(styleRatio)));

    // Set view
    renderingMap.unwrap().setView(
      new View({
        center: layout.view.center,
        resolution: layout.view.resolution,
        projection: layout.view.projection.name,
      })
    );

    // Prepare a canvas for export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = dimension.width;
    exportCanvas.height = dimension.height;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) {
      return Promise.reject(new Error('Canvas 2D context not available'));
    }

    // Paint a white rectangle as background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, dimension.width, dimension.height);

    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      // Render layers
      renderingMap.unwrap().once('rendercomplete', () => {
        const layers = support.querySelectorAll('.ol-layer canvas');
        layers.forEach((layer) => {
          logger.info('Rendering layer: ', layer);

          if (!(layer instanceof HTMLCanvasElement)) {
            return reject(new Error(`Bad element selected: ${layer.constructor.name}`));
          }

          if (layer.width > 0) {
            const opacity = (layer.parentNode as HTMLElement | null)?.style.opacity || '';
            ctx.globalAlpha = opacity === '' ? 1 : Number(opacity);

            // Get the transform parameters from the style's transform matrix
            const transform = layer.style.transform.match(/^matrix\(([^(]*)\)$/);
            if (transform) {
              const args = transform[1].split(',').map(Number) as number[];
              ctx.setTransform(args[0], args[1], args[2], args[3], args[4], args[5]);
            }

            ctx.drawImage(layer, 0, 0);
          }
        });

        const renderLegend = async () => {
          // Render legend
          legendCanvas.width = legend.width * styleRatio;
          legendCanvas.height = legend.height * styleRatio;
          await this.legendRenderer.renderLegend(legend, legendCanvas, styleRatio);

          const position = this.legendRenderer.getLegendPosition(legend, legendCanvas, exportCanvas);
          if (!position) {
            throw new Error(`Unhandled legend display: ${legend.display}`);
          }
          ctx.drawImage(legendCanvas, position.x, position.y);
        };

        renderLegend()
          .then(() => resolve(exportCanvas))
          .catch(reject);
      });

      renderingMap.unwrap().render();
    });
  }
}
