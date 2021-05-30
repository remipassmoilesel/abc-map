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
import { DrawInteraction, drawInteractionFactory } from './drawInteractionFactory';
import GeometryType from 'ol/geom/GeometryType';
import VectorSource from 'ol/source/Vector';
import { SinonStub } from 'sinon';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import View from 'ol/View';
import * as sinon from 'sinon';
import { TestHelper } from '../../utils/test/TestHelper';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { Polygon } from 'ol/geom';
import { AddFeaturesTask } from '../../history/tasks/features/AddFeaturesTask';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import Feature from 'ol/Feature';
import { LayerFactory } from '../../geo/layers/LayerFactory';
import { VectorLayerWrapper } from '../../geo/layers/LayerWrapper';
import { UpdateGeometriesTask } from '../../history/tasks/features/UpdateGeometriesTask';

// This test check that interactions created by drawInteractionFactory() can be used correctly together on a map
// TODO: terminate

describe('drawInteractionFactory.ts', () => {
  let target: HTMLDivElement;
  let map: Map;
  let source: VectorSource;
  let layer: VectorLayerWrapper;

  let interaction: DrawInteraction;
  let modify: Modify;
  let draw: Draw;
  let snap: Snap;
  let select: Select;

  let getStyleStub: SinonStub;
  let onTaskStub: SinonStub;

  const width = 800;
  const height = 600;

  beforeEach(async () => {
    // Set up map with one layer
    target = document.createElement('div');
    const style = target.style;
    style.position = 'absolute';
    style.left = '0px';
    style.top = '0px';
    style.width = `${width}px`;
    style.height = `${height}px`;
    document.body.appendChild(target);

    source = new VectorSource();
    layer = LayerFactory.newVectorLayer(source);
    map = new Map({
      interactions: [],
      target: target,
      layers: [layer.unwrap()],
      view: new View({
        projection: 'EPSG:4326',
        center: [0, 0],
        resolution: 1,
      }),
    });

    // This is needed to make event dispatch effective
    map.setSize([width, height]);

    // Set up interaction
    getStyleStub = sinon.stub();
    onTaskStub = sinon.stub();
    interaction = drawInteractionFactory(GeometryType.POLYGON, source, getStyleStub, onTaskStub);
    interaction.interactions.forEach((i) => map.addInteraction(i));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [modify, draw, snap, select] = interaction.interactions;

    await renderMap();
  });

  afterEach(() => {
    interaction?.dispose();
    map.dispose();
    document.body.removeChild(target);
  });

  describe('Draw', () => {
    it('create a polygon should work', async () => {
      // Prepare
      getStyleStub.returns(TestHelper.sampleStyleProperties());

      // Act
      click(10, 10);
      click(60, 10);
      click(60, 60);
      doubleClick(10, 60);

      // Assert
      expect(source.getFeatures()).toHaveLength(1);
      expect(getStyleStub.callCount).toEqual(1);
      expect(onTaskStub.callCount).toEqual(1);

      const feature = featureFromSource(0);
      expect(feature.getGeometry()).toBeInstanceOf(Polygon);
      expect(feature.getGeometry()?.getCoordinates()).toEqual([
        [
          [10, -10],
          [60, -10],
          [60, -60],
          [10, -60],
          [10, -10],
        ],
      ]);
      expect(feature.getStyleProperties()).toEqual(TestHelper.sampleStyleProperties());
      expect(feature.isSelected()).toEqual(false);

      const task = onTaskStub.args[0][0] as AddFeaturesTask;
      expect(task).toBeInstanceOf(AddFeaturesTask);
      expect(task.source).toStrictEqual(source);
      expect(task.features).toEqual([feature]);

      // We ensure that we are not drawing
      expect(draw.getOverlay().getSource().getFeatures().length).toEqual(0);
    });
  });

  describe('Select', () => {
    it('select a polygon on active layer should work', async () => {
      // Prepare
      layer.setActive(true);
      getStyleStub.returns(TestHelper.sampleStyleProperties());

      click(10, 10);
      click(60, 10);
      click(60, 60);
      doubleClick(10, 60);
      await renderMap();

      const feature = featureFromSource(0);
      expect(feature.isSelected()).toBe(false);

      // Act
      singleClick(20, 20, { ctrl: true });

      // Assert
      expect(feature.isSelected()).toBe(true);
    });

    it('select a polygon on active layer should unselect previous', async () => {
      // Prepare
      layer.setActive(true);
      getStyleStub.returns(TestHelper.sampleStyleProperties());

      // Draw first
      click(10, 10);
      click(60, 10);
      click(60, 60);
      doubleClick(10, 60);
      await renderMap();

      // Draw second
      click(110, 110);
      click(160, 110);
      click(160, 160);
      doubleClick(110, 160);
      await renderMap();

      // Act
      singleClick(20, 20, { ctrl: true });
      singleClick(120, 120, { ctrl: true });

      // Assert
      expect(featureFromSource(0).isSelected()).toBe(false);
      expect(featureFromSource(1).isSelected()).toBe(true);
    });

    it('draw after select should clean selection', async () => {
      // Prepare
      layer.setActive(true);
      getStyleStub.returns(TestHelper.sampleStyleProperties());

      // Draw first
      click(10, 10);
      click(60, 10);
      click(60, 60);
      doubleClick(10, 60);
      await renderMap();
      singleClick(20, 20, { ctrl: true });

      // Act
      click(110, 110);
      click(160, 110);
      click(160, 160);
      doubleClick(110, 160);
      await renderMap();

      // Assert
      expect(featureFromSource(0).isSelected()).toBe(false);
      expect(featureFromSource(1).isSelected()).toBe(false);
    });
  });

  describe('Modify', () => {
    it('modify a polygon on active layer should work', async () => {
      // Prepare
      layer.setActive(true);
      getStyleStub.returns(TestHelper.sampleStyleProperties());

      click(10, 10);
      click(60, 10);
      click(60, 60);
      doubleClick(10, 60);
      await renderMap();

      singleClick(20, 20, { ctrl: true });
      await renderMap();

      // Act
      drag(60, 60, 180, 180);

      // Assert
      const feature = featureFromSource(0);
      expect(feature.isSelected()).toBe(true);
      expect(feature.getGeometry()?.getCoordinates()).toEqual([
        [
          [10, -10],
          [60, -10],
          [180, -180],
          [10, -60],
          [10, -10],
        ],
      ]);

      expect(onTaskStub.callCount).toEqual(2);
      const task = onTaskStub.args[1][0] as UpdateGeometriesTask;
      expect(task.items.length).toEqual(1);
      expect(task.items[0].feature).toEqual(feature);
      expect(task.items[0].before).toBeInstanceOf(Polygon);
      expect((task.items[0].before as Polygon).getCoordinates()).toEqual([
        [
          [10, -10],
          [60, -10],
          [60, -60],
          [10, -60],
          [10, -10],
        ],
      ]);

      expect((task.items[0].after as Polygon).getCoordinates()).toEqual([
        [
          [10, -10],
          [60, -10],
          [180, -180],
          [10, -60],
          [10, -10],
        ],
      ]);
    });
  });

  function featureFromSource(i: number): FeatureWrapper<Polygon> {
    return FeatureWrapper.from<Polygon>(source.getFeatures()[i] as Feature<Polygon>);
  }

  /**
   * After map modifications, we must render in order to let map update its state
   */
  function renderMap(): Promise<void> {
    return new Promise<void>((resolve) => {
      map.render();
      map.once('postrender', () => {
        resolve();
      });
    });
  }

  function drag(startX: number, startY: number, endX: number, endY: number, options?: SimulatedEventOptions) {
    simulateEvent(MapBrowserEventType.POINTERMOVE, startX, startY, options);
    simulateEvent(MapBrowserEventType.POINTERDOWN, startX, startY, options);
    simulateEvent(MapBrowserEventType.POINTERMOVE, endX, endY, options);
    simulateEvent(MapBrowserEventType.POINTERDRAG, endX, endY, options);
    simulateEvent(MapBrowserEventType.POINTERUP, endX, endY, options);
  }

  function click(x: number, y: number, options?: SimulatedEventOptions) {
    simulateEvent(MapBrowserEventType.POINTERMOVE, x, y, options);
    simulateEvent(MapBrowserEventType.POINTERDOWN, x, y, options);
    simulateEvent(MapBrowserEventType.POINTERUP, x, y, options);
  }

  function singleClick(x: number, y: number, options?: SimulatedEventOptions) {
    simulateEvent(MapBrowserEventType.SINGLECLICK, x, y, options);
  }

  function doubleClick(x: number, y: number, options?: SimulatedEventOptions) {
    click(x, y, options);
    click(x, y, options);
  }

  interface SimulatedEventOptions {
    shift?: boolean;
    ctrl?: boolean;
    button?: number;
  }

  // This function was taken from openlayers/test/browser/spec/ol/interaction/draw.test.js
  // Event fields are a bit weird, but this is fine lol
  function simulateEvent(type: MapBrowserEventType, x: number, y: number, options?: SimulatedEventOptions): MapBrowserEvent {
    const viewport = map.getViewport();
    const position = viewport.getBoundingClientRect();
    const event: any = {};
    event.type = type;
    event.target = viewport.firstChild;
    event.clientX = position.left + x + width / 2;
    event.clientY = position.top + y + height / 2;
    event.ctrlKey = options?.ctrl ?? false;
    event.shiftKey = options?.shift ?? false;
    event.preventDefault = function () {
      return;
    };
    event.pointerType = 'mouse';
    event.pointerId = 1;
    event.button = options?.button ?? 0;
    const simulatedEvent = new MapBrowserEvent(type, map, event);

    map.handleMapBrowserEvent(simulatedEvent);
    return simulatedEvent;
  }
});
