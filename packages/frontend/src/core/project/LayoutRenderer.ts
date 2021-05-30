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
import { BlobIO, Logger } from '@abc-map/shared';
import { AbcFile, AbcLayout, Zipper } from '@abc-map/shared';
import { MapFactory } from '../geo/map/MapFactory';
import { jsPDF } from 'jspdf';

export const logger = Logger.get('LayoutRenderer');

// TODO: test

export class LayoutRenderer {
  private map?: MapWrapper;
  private support?: HTMLDivElement;

  public init(support: HTMLDivElement) {
    this.support = support;
    this.map = MapFactory.createNaked();
    this.map.setTarget(support);
  }

  public dispose() {
    this.map?.dispose();
  }

  public async renderLayoutsAsPdf(layouts: AbcLayout[], sourceMap: MapWrapper): Promise<Blob> {
    const pdf = new jsPDF();

    // jsPDF create a first page that may not correspond to first layout
    pdf.deletePage(1);

    for (const layout of layouts) {
      const format = layout.format;
      pdf.addPage([format.width, format.height], format.orientation);

      const canvas = await this.renderLayout(layout, sourceMap);
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, layout.format.width, layout.format.height);
    }

    return pdf.output('blob');
  }

  public async renderLayoutsAsPng(layouts: AbcLayout[], sourceMap: MapWrapper): Promise<Blob> {
    const files: AbcFile<Blob>[] = [];
    for (const layout of layouts) {
      const canvas = await this.renderLayout(layout, sourceMap);
      const image = await BlobIO.canvasToPng(canvas);
      files.push({ path: layout.name, content: image });
    }

    return Zipper.forFrontend().zipFiles(files);
  }

  public renderLayout(layout: AbcLayout, sourceMap: MapWrapper): Promise<HTMLCanvasElement> {
    logger.info('Rendering layout: ', layout);
    const renderingMap = this.map;
    const support = this.support;
    if (!renderingMap || !support) {
      throw new Error('You must call init() before rendering');
    }

    // We adapt size of map to layout
    const dimension = LayoutHelper.formatToPixel(layout.format);
    support.style.marginTop = '200px';
    support.style.width = `${dimension.width}px`;
    support.style.height = `${dimension.height}px`;
    renderingMap.unwrap().updateSize();

    const styleRatio = LayoutHelper.styleRatio(dimension.width, dimension.height);

    // We copy layers from sourceMap to exportMap
    renderingMap.unwrap().getLayers().clear();
    sourceMap.getLayers().forEach((lay) => renderingMap.addLayer(lay.shallowClone(styleRatio)));

    // We set view
    renderingMap.unwrap().setView(
      new View({
        center: layout.view.center,
        resolution: layout.view.resolution,
        projection: layout.view.projection.name,
      })
    );

    const canvas = document.createElement('canvas');
    canvas.width = dimension.width;
    canvas.height = dimension.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return Promise.reject(new Error('Canvas 2D context not available'));
    }

    // We paint a white rectangle as background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, dimension.width, dimension.height);

    // Then we export layers when render complete
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      renderingMap.unwrap().once('rendercomplete', () => {
        const layers = support.querySelectorAll('.ol-layer canvas');
        layers.forEach((layer) => {
          logger.info('Rendering layer: ', layer);

          if (!(layer instanceof HTMLCanvasElement)) {
            return reject(new Error(`Bad element selected: ${layer.constructor.name}`));
          }

          if (layer.width > 0) {
            const opacity = (layer.parentNode as HTMLElement)?.style.opacity || '';
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

        resolve(canvas);
      });

      renderingMap.unwrap().render();
    });
  }
}
