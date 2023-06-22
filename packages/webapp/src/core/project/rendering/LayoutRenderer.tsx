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

import { MapWrapper } from '../../geo/map/MapWrapper';
import { LayoutHelper } from '../LayoutHelper';
import View from 'ol/View';
import { AbcFile, AbcLayout, BlobIO, LayoutFormat, Logger, Zipper } from '@abc-map/shared';
import { MapFactory } from '../../geo/map/MapFactory';
import { jsPDF } from 'jspdf';
import { StaticAttributions } from '../../../components/static-attributions/StaticAttributions';
import { MapUi } from '../../../components/map-ui/MapUi';
import html2canvas from 'html2canvas';
import { FloatingTextFrame } from '../../../components/text-frame/FloatingTextFrame';
import { FloatingScale } from '../../../components/floating-scale/FloatingScale';
import { DimensionsPx } from '../../utils/DimensionsPx';
import { toPrecision } from '../../utils/numbers';
import { FloatingNorthArrow } from '../../../components/floating-north-arrow/FloatingNorthArrow';
import { createRoot } from 'react-dom/client';

export const logger = Logger.get('LayoutRenderer');

export class LayoutRenderer {
  private rootElement?: HTMLDivElement;
  private map?: MapWrapper;

  public init() {
    // Create support for map and others elements
    this.rootElement = document.createElement('div');
    this.rootElement.style.position = 'fixed';
    this.rootElement.style.bottom = '-10000px';
    document.body.append(this.rootElement);

    // Create map
    this.map = MapFactory.createNaked();
  }

  public dispose() {
    this.map?.dispose();
    this.rootElement?.remove();
  }

  public async renderLayoutsAsPdf(layouts: AbcLayout[], sourceMap: MapWrapper): Promise<Blob> {
    const pdf = new jsPDF();

    // jsPDF create a first page that may not correspond to first layout
    pdf.deletePage(1);

    for (const layout of layouts) {
      const format = layout.format;
      pdf.addPage([format.width, format.height], format.orientation);

      const canvas = await this.renderLayout(layout, sourceMap);
      pdf.addImage(canvas.toDataURL('image/jpeg', 1), 'JPEG', 0, 0, layout.format.width, layout.format.height, undefined, 'NONE');
    }

    return pdf.output('blob');
  }

  public async renderLayoutsAsPng(layouts: AbcLayout[], sourceMap: MapWrapper): Promise<Blob> {
    const files: AbcFile<Blob>[] = [];
    for (const layout of layouts) {
      const canvas = await this.renderLayout(layout, sourceMap);
      const image = await BlobIO.canvasToPng(canvas);
      files.push({ path: `${layout.name}.png`, content: image });
    }

    return Zipper.forBrowser().zipFiles(files);
  }

  private async renderLayout(layout: AbcLayout, sourceMap: MapWrapper): Promise<HTMLCanvasElement> {
    logger.info('Rendering layout: ', layout);
    const renderingMap = this.map;
    const rootElement = this.rootElement;
    if (!renderingMap || !rootElement) {
      throw new Error('You must call init() before rendering');
    }

    // Compute style ratio
    const dimensions = LayoutHelper.formatToPixel(layout.format);
    const previewDimensions = this.getPreviewDimensionsFor(layout.format);
    const ratio = this.getStyleRatio(previewDimensions, dimensions);
    logger.info(`Rendering style ratio: ${ratio}`);

    // Copy layers from sourceMap to exportMap
    renderingMap.importLayersFrom(sourceMap, { withSelection: false, ratio });

    await this.renderMapDom(renderingMap, layout, `${dimensions.width}px`, `${dimensions.height}px`, ratio);

    // Set view
    renderingMap.unwrap().setView(
      new View({
        center: layout.view.center,
        resolution: layout.view.resolution,
        projection: layout.view.projection.name,
        rotation: layout.view.rotation,
      })
    );

    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      // We trigger map rendering
      renderingMap.unwrap().once('rendercomplete', () => {
        html2canvas(rootElement, { backgroundColor: '#ffffff', imageTimeout: 0 }).then(resolve).catch(reject);
      });

      renderingMap.unwrap().render();
    });
  }

  /**
   * Compute preview map dimensions from layout. The main goal of this function is to create
   * a map that fit both layout and user screen.
   */
  public getPreviewDimensionsFor(format: LayoutFormat): DimensionsPx {
    const maxWidth = Math.round(document.body.offsetWidth - document.body.offsetWidth / 5);
    const maxHeight = Math.round(document.body.offsetHeight - document.body.offsetHeight / 5);

    let width = maxWidth;
    let height = Math.round((format.height * width) / format.width);
    if (height > maxHeight) {
      height = maxHeight;
      width = Math.round((format.width * height) / format.height);
    }
    return { width, height };
  }

  private getStyleRatio(preview: DimensionsPx, layout: DimensionsPx) {
    const previewDiag = Math.sqrt(preview.width ** 2 + preview.height ** 2);
    const layoutDiag = Math.sqrt(layout.width ** 2 + layout.height ** 2);

    return toPrecision(layoutDiag / previewDiag, 9);
  }

  private renderMapDom(map: MapWrapper, layout: AbcLayout, width: string, height: string, ratio: number): Promise<void> {
    const container = this.rootElement;
    if (!container) {
      return Promise.reject(new Error('You must call init() before'));
    }

    const reactRoot = createRoot(container);

    return new Promise((resolve) => {
      reactRoot.render(
        <>
          {/* Map */}
          <MapUi map={map} width={width} height={height} />

          {/* Text frames */}
          {layout.textFrames.map((frame) => (
            <FloatingTextFrame key={frame.id} frame={frame} readOnly={true} ratio={ratio} />
          ))}

          {/* Scale */}
          {layout.scale && <FloatingScale map={map} scale={layout.scale} readOnly={true} ratio={ratio} baseFontSizeEm={0.9} />}

          {/* North */}
          {layout.north && <FloatingNorthArrow map={map} north={layout.north} ratio={ratio} readOnly={true} />}

          {/* Attributions */}
          <StaticAttributions map={map} ratio={ratio} />

          {/*resolve() will be called when div will be created, see: https://github.com/reactwg/react-18/discussions/5*/}
          {/*  We leave a second more in order to avoid occasional CSS style loading errors */}
          <div ref={() => setTimeout(resolve, 1000)} />
        </>
      );
    });
  }
}
