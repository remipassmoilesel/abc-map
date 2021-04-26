import { MapWrapper } from '../geo/map/MapWrapper';
import { LayoutHelper } from './LayoutHelper';
import View from 'ol/View';
import { AbcFile, BlobIO, Logger, Zipper } from '@abc-map/frontend-commons';
import { AbcLayout } from '@abc-map/shared-entities';
import { MapFactory } from '../geo/map/MapFactory';
import { jsPDF } from 'jspdf';

const logger = Logger.get('LayoutRenderer', 'debug');

export class LayoutRenderer {
  private map?: MapWrapper;

  public init() {
    this.map = MapFactory.createNaked();
  }

  public dispose() {
    this.map?.dispose();
  }

  public async renderLayoutsAsPdf(layouts: AbcLayout[], sourceMap: MapWrapper, support: HTMLDivElement): Promise<Blob> {
    const pdf = new jsPDF();
    for (const layout of layouts) {
      const format = layout.format;
      const index = layouts.indexOf(layout);
      if (index !== 0) {
        pdf.addPage([format.width, format.height], format.orientation);
      }

      const canvas = await this.renderLayout(layout, sourceMap, support);
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, layout.format.width, layout.format.height);
    }

    return pdf.output('blob');
  }

  public async renderLayoutsAsPng(layouts: AbcLayout[], sourceMap: MapWrapper, support: HTMLDivElement): Promise<Blob> {
    const files: AbcFile[] = [];
    for (const layout of layouts) {
      const canvas = await this.renderLayout(layout, sourceMap, support);
      const image = await BlobIO.canvasToPng(canvas);
      files.push({ path: layout.name, content: image });
    }

    return Zipper.zipFiles(files);
  }

  public renderLayout(layout: AbcLayout, sourceMap: MapWrapper, support: HTMLDivElement): Promise<HTMLCanvasElement> {
    logger.info('Rendering layout: ', layout);
    const renderingMap = this.map;
    if (!renderingMap) {
      throw new Error('You must call init() before rendering');
    }
    renderingMap.setTarget(support);

    // We adapt size of map to layout
    const dimension = LayoutHelper.layoutToPixel(layout);
    support.style.marginTop = '200px';
    support.style.width = `${dimension.width}px`;
    support.style.height = `${dimension.height}px`;
    renderingMap.unwrap().updateSize();

    // We copy layers from sourceMap to exporMap
    renderingMap.unwrap().getLayers().clear();
    sourceMap.getLayers().forEach((lay) => renderingMap.addLayer(lay));

    const viewResolution = renderingMap.unwrap().getView().getResolution();
    if (!viewResolution) {
      return Promise.reject(new Error('ViewResolution not available'));
    }

    const canvas = document.createElement('canvas');
    canvas.width = dimension.width;
    canvas.height = dimension.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return Promise.reject(new Error('ctx not available'));
    }

    // We paint a white rectangle as background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, dimension.width, dimension.height);

    // Then we export layers on render complete
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

      // We set view and trigger render
      renderingMap.unwrap().setView(
        new View({
          center: layout.view.center,
          resolution: layout.view.resolution,
          projection: layout.view.projection.name,
        })
      );
    });
  }
}
