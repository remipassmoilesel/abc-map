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

import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import View from 'ol/View';
import { TestHelper } from '../../../utils/test/TestHelper';
import { FeatureWrapper, OlGeometry } from '../../../geo/features/FeatureWrapper';
import Feature from 'ol/Feature';
import { LayerFactory } from '../../../geo/layers/LayerFactory';
import { VectorLayerWrapper } from '../../../geo/layers/LayerWrapper';
import { Geometry } from 'ol/geom';

interface SimulatedEventOptions {
  shift?: boolean;
  ctrl?: boolean;
  button?: number;
}

/**
 * This class wrap a wap with test helpers designed for drawing tools tests.
 *
 * This was inspired by openlayers tests but behavior can be weird as we use JSDom and no rendering is done.
 *
 */
export class DrawingTestMap {
  private target: HTMLDivElement;
  private map: Map;
  private vectorSource: VectorSource;
  private layer: VectorLayerWrapper;

  private mapWidth = 800;
  private mapHeight = 600;

  constructor() {
    // Set up map with one layer
    this.target = document.createElement('div');
    const style = this.target.style;
    style.position = 'absolute';
    style.left = '0px';
    style.top = '0px';
    style.width = `${this.mapWidth}px`;
    style.height = `${this.mapHeight}px`;
    document.body.appendChild(this.target);

    // As there are no rendering in JSDom, we set bounding client rect here
    this.target.getBoundingClientRect = () => {
      const rect = {
        x: 0,
        y: 0,
        width: this.mapWidth,
        height: this.mapHeight,
        top: 0,
        right: this.mapWidth,
        bottom: this.mapHeight,
        left: 0,
      };

      return {
        ...rect,
        toJSON(): any {
          return rect;
        },
      };
    };

    this.vectorSource = new VectorSource();
    this.layer = LayerFactory.newVectorLayer(this.vectorSource);
    this.layer.setActive(true);

    this.map = new Map({
      interactions: [],
      target: this.target,
      layers: [this.layer.unwrap()],
      view: new View({
        projection: 'EPSG:4326',
        center: [0, 0],
        resolution: 1,
      }),
    });
  }

  public async init() {
    // This is needed to make event dispatch effective
    this.map.setSize([this.mapWidth, this.mapHeight]);

    await TestHelper.renderMap(this.map);
  }

  public render(): Promise<void> {
    return TestHelper.renderMap(this.map);
  }

  public getMap(): Map {
    return this.map;
  }

  public getVectorLayer(): VectorLayerWrapper {
    return this.layer;
  }

  public getVectorSource(): VectorSource<Geometry> {
    return this.vectorSource;
  }

  public addFeatures(feats: Feature<Geometry>[]): void {
    this.vectorSource.addFeatures(feats);
  }

  public getFeature<Geom extends OlGeometry>(i: number): FeatureWrapper<Geom> {
    return FeatureWrapper.from<Geom>(this.vectorSource.getFeatures()[i] as Feature<Geom>);
  }

  public async drag(startX: number, startY: number, endX: number, endY: number, options?: SimulatedEventOptions): Promise<void> {
    await this.simulateEvent(MapBrowserEventType.POINTERMOVE, startX, startY, options);
    await this.simulateEvent(MapBrowserEventType.POINTERDOWN, startX, startY, options);
    await this.simulateEvent(MapBrowserEventType.POINTERDRAG, startX + 5, startY + 5, options);
    await this.simulateEvent(MapBrowserEventType.POINTERDRAG, endX - 5, endY - 5, options);
    await this.simulateEvent(MapBrowserEventType.POINTERDRAG, endX, endY, options);
    await this.simulateEvent(MapBrowserEventType.POINTERUP, endX, endY, options);
  }

  public async click(x: number, y: number, options?: SimulatedEventOptions): Promise<void> {
    await this.simulateEvent(MapBrowserEventType.POINTERMOVE, x, y, options);
    await this.simulateEvent(MapBrowserEventType.POINTERDOWN, x, y, options);
    await this.simulateEvent(MapBrowserEventType.POINTERUP, x, y, options);
    await this.simulateEvent(MapBrowserEventType.SINGLECLICK, x, y, options);
  }

  public async doubleClick(x: number, y: number, options?: SimulatedEventOptions): Promise<void> {
    await this.click(x, y, options);
    await this.click(x, y, options);
  }

  /**
   * This function was taken from openlayers/test/browser/spec/ol/interaction/draw.test.js
   *
   * Coordinates are relative to center of the map.
   * Event fields are a bit weird, but this is fine lol.
   *
   * @param type
   * @param x
   * @param y
   * @param options
   * @private
   */
  private async simulateEvent(type: MapBrowserEventType, x: number, y: number, options?: SimulatedEventOptions): Promise<MapBrowserEvent> {
    const viewport = this.map.getViewport();
    const position = this.target.getBoundingClientRect();

    const event = {
      type,
      target: viewport.firstChild,
      clientX: position.left + x + this.mapWidth / 2,
      clientY: position.top + y + this.mapHeight / 2,
      ctrlKey: options?.ctrl ?? false,
      shiftKey: options?.shift ?? false,
      preventDefault: function () {
        return;
      },
      stopPropagation: function () {
        return;
      },
      pointerType: 'mouse',
      pointerId: 1,
      button: options?.button ?? 0,
    };

    if (event.clientX < 0 || event.clientX > this.mapWidth) {
      throw new Error('X is out of map: ' + x);
    }

    if (event.clientY < 0 || event.clientY > this.mapHeight) {
      throw new Error('Y is out of map: ' + y);
    }

    const simulatedEvent = new MapBrowserEvent(type, this.map, event as any);

    this.map.handleMapBrowserEvent(simulatedEvent);
    await this.render();

    return simulatedEvent;
  }

  public dispose() {
    this.map.dispose();
    document.body.removeChild(this.target);
  }
}
