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

import { MapWrapper } from './map/MapWrapper';
import { MapFactory } from './map/MapFactory';
import { Logger } from '@abc-map/shared';

export const logger = Logger.get('MapPreloader.ts', 'info');

export interface PreloadEvent {
  value: number;
}

export interface PreloadingContext {
  cancel: () => void;
  promise: Promise<void>;
}

const maxLoadingOperations = 60;

/**
 * This helper preload map.
 *
 * We could use
 */
export class MapPreloader {
  private emitter = document.createDocumentFragment();
  private rootElement?: HTMLDivElement;
  private map?: MapWrapper;

  public init() {
    // Create support for map
    this.rootElement = document.createElement('div');
    this.rootElement.style.position = 'fixed';
    this.rootElement.style.bottom = '-10000px';
    this.rootElement.style.width = '600px';
    this.rootElement.style.height = '600px';
    document.body.append(this.rootElement);

    // Create map
    this.map = MapFactory.createNaked();
    this.map.setTarget(this.rootElement);
  }

  public dispose() {
    this.map?.dispose();
    this.rootElement?.remove();
  }

  public setRenderingMap(map: MapWrapper) {
    this.map = map;
  }

  public load(sourceMap: MapWrapper, nbrZoomSteps: number): PreloadingContext {
    let cancel = false;

    const sourceView = sourceMap.unwrap().getView();
    const renderingMap = this.map;
    const renderingView = this.map?.unwrap().getView();
    if (!renderingMap || !renderingView) {
      throw new Error('You must call init() before');
    }

    const promise = (async () => {
      // We MUST set rendering map size from source map size
      renderingMap.unwrap().setSize(sourceMap.unwrap().getSize());
      renderingMap.importLayersFrom(sourceMap);

      // Get base parameters from source
      const sZoom = sourceView.getZoom() ?? 0;
      const [sMinx, sMiny, sMaxx, sMaxy] = sourceView.calculateExtent(sourceMap.unwrap().getSize());

      let totalOperations = 0;
      loading: for (let i = 0; i < nbrZoomSteps; i++) {
        let x = sMinx;
        let y = sMiny;
        const zoom = sZoom + i;

        // We MUST set view a first time to calculate extent
        renderingView.setCenter([x, y]);
        renderingView.setZoom(zoom);

        const [minx, miny, maxx, maxy] = renderingView.calculateExtent(renderingMap.unwrap().getSize());
        const stepX = maxx - minx;
        const stepY = maxy - miny;

        // Number of render, for UI purposes
        let operations = 0;
        const maxOpsPerSteps = Math.round(100 / nbrZoomSteps);

        while (y <= sMaxy) {
          while (x <= sMaxx) {
            // We prevent too many operations in order to not overload servers
            if (totalOperations > maxLoadingOperations) {
              cancel = true;
            }

            // We cancel before end of loading
            if (cancel) {
              break loading;
            }

            // We load map
            renderingView.setCenter([x, y]);
            renderingView.setZoom(zoom);
            await renderingMap.render();

            // We cheat a little on loading
            const value = i * maxOpsPerSteps + Math.min(maxOpsPerSteps, operations);
            this.emitter.dispatchEvent(new CustomEvent<PreloadEvent>('preload', { detail: { value } }));

            // We step forward
            x += stepX;
            operations++;
            totalOperations++;
          }

          // We step forward
          y += stepY;
          x = sMinx;
        }

        const value = i * maxOpsPerSteps + maxOpsPerSteps;
        this.emitter.dispatchEvent(new CustomEvent<PreloadEvent>('preload', { detail: { value } }));
      }

      // Dispatch 100 at the end of the process
      this.emitter.dispatchEvent(new CustomEvent<PreloadEvent>('preload', { detail: { value: 100 } }));
    })();

    return { cancel: () => (cancel = true), promise };
  }

  public addEventListener(listener: (ev: CustomEvent<PreloadEvent>) => void) {
    this.emitter.addEventListener('preload', listener as EventListener);
  }

  public removeEventListener(listener: (ev: CustomEvent<PreloadEvent>) => void) {
    this.emitter.removeEventListener('preload', listener as EventListener);
  }
}
