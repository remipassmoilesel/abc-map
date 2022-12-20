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

import { AbcView, BlobIO, Logger } from '@abc-map/shared';
import { MapFactory } from '../../core/geo/map/MapFactory';
import { DimensionsPx } from '../../core/utils/DimensionsPx';
import { LayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { Views } from '../../core/geo/Views';

export const logger = Logger.get('PreviewExporter');

// FIXME: use html2canvas instead ?
export class PreviewExporter {
  private support?: HTMLDivElement;
  private map?: MapWrapper;

  public async exportPreviews(layer: LayerWrapper, views: AbcView[], dimensions: DimensionsPx): Promise<Blob[]> {
    // Add map target, create map
    this.support = document.createElement('div');
    this.support.style.position = 'absolute';
    this.support.style.bottom = '-10000px';
    document.body.append(this.support);

    this.map = MapFactory.createNaked();
    this.map.setTarget(this.support);
    this.map.addLayer(layer);

    const images: Blob[] = [];
    try {
      for (let i = 0; i < views.length; i++) {
        const view = views[i];
        const canvas = await this.exportMap(view, dimensions);
        if (!canvas) {
          continue;
        }
        const preview = await BlobIO.canvasToPng(canvas);
        images.push(new Blob([preview]));
      }
    } finally {
      this.support.remove();
      this.map.dispose();
    }

    return images;
  }

  /**
   * Export specified view, may timeout and return an empty array
   * @param view
   * @param exportDimensions
   * @param timeoutSec
   * @private
   */
  private exportMap(view: AbcView, exportDimensions: DimensionsPx, timeoutSec = 30): Promise<HTMLCanvasElement | undefined> {
    const support = this.support;
    const renderingMap = this.map;
    if (!renderingMap || !support) {
      throw new Error('You must call init() before rendering');
    }

    support.style.width = `${exportDimensions.width}px`;
    support.style.height = `${exportDimensions.height}px`;

    // Set view
    renderingMap.unwrap().setView(Views.abcToOl(view));

    // Prepare a canvas for export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportDimensions.width;
    exportCanvas.height = exportDimensions.height;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) {
      return Promise.reject(new Error('Canvas 2D context not available'));
    }

    // Paint a white rectangle as background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, exportDimensions.width, exportDimensions.height);

    // Layers rendering
    const renderLayers = async () => {
      const layers = support.querySelectorAll('.ol-layer canvas');
      layers.forEach((layer) => {
        logger.info('Rendering layer: ', layer);

        // We reset transform before each layer rendering
        ctx.resetTransform();

        if (!(layer instanceof HTMLCanvasElement)) {
          logger.error(`Bad element selected: ${layer.constructor.name}`, layer);
          return;
        }

        if (layer.width > 0) {
          const opacity = (layer.parentNode as HTMLElement | null)?.style.opacity || '';
          ctx.globalAlpha = opacity === '' ? 1 : Number(opacity);

          // Get the transform parameters from the style's transform matrix
          const transform = layer.style.transform.match(/^matrix\(([^(]*)\)$/);
          if (transform) {
            const args = transform[1].split(',').map(Number);
            ctx.setTransform(args[0], args[1], args[2], args[3], args[4], args[5]);
          }

          ctx.drawImage(layer, 0, 0);
        }
      });
    };

    return new Promise<HTMLCanvasElement | undefined>((resolve, reject) => {
      // Trigger timeout in order to not block whole export
      const timeout = setTimeout(() => {
        logger.error('Timeout exporting view', view);
        resolve(undefined);
      }, timeoutSec * 1000);

      // We trigger map rendering
      renderingMap.unwrap().once('rendercomplete', () => {
        renderLayers()
          .then(() => {
            clearTimeout(timeout);
            resolve(exportCanvas);
          })
          .catch(reject);
      });

      renderingMap.unwrap().render();
    });
  }
}
