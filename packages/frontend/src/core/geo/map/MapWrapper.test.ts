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

import { MapFactory } from './MapFactory';
import { LayerProperties, MapTool, PredefinedLayerModel } from '@abc-map/shared';
import { Map } from 'ol';
import { logger, MapWrapper } from './MapWrapper';
import { ToolRegistry } from '../../tools/ToolRegistry';
import TileLayer from 'ol/layer/Tile';
import { LayerFactory } from '../layers/LayerFactory';
import VectorImageLayer from 'ol/layer/VectorImage';
import { DragRotateAndZoom } from 'ol/interaction';
import { LineStringTool } from '../../tools/line-string/LineStringTool';
import { TestHelper } from '../../utils/test/TestHelper';

logger.disable();

describe('MapWrapper', function () {
  it('setDefaultLayers()', () => {
    const map = MapFactory.createNaked();
    map.addLayer(LayerFactory.newVectorLayer());

    map.setDefaultLayers();

    const layers = map.getLayers();
    expect(layers).toHaveLength(2);
    expect(layers[0].unwrap()).toBeInstanceOf(TileLayer);
    expect(layers[1].unwrap()).toBeInstanceOf(VectorImageLayer);
    expect(layers[0].isActive()).toBe(false);
    expect(layers[1].isActive()).toBe(true);
  });

  describe('setTarget(), dispose()', () => {
    it('setTarget() should set proper target and add resize observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});

      const map = new MapWrapper(olMap);
      map.addLayer(LayerFactory.newVectorLayer());
      map.setTarget(support);

      expect(olMap.getTarget()).toEqual(support);
      expect(map.getSizeObserver()).toBeDefined();
    });

    it('setTarget() should unset target and resize observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});

      const map = new MapWrapper(olMap);
      map.addLayer(LayerFactory.newVectorLayer());
      map.setTarget(support);
      map.setTarget(undefined);

      expect(olMap.getTarget()).toEqual(undefined);
      expect(map.getSizeObserver()).toBeUndefined();
    });

    it('dispose() should dispose map and size observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});
      olMap.dispose = jest.fn();

      const map = new MapWrapper(olMap);
      map.addLayer(LayerFactory.newVectorLayer());
      map.setTarget(support);

      expect(map.getSizeObserver()).toBeDefined();

      map.dispose();
      expect(olMap.dispose).toHaveBeenCalled();
      expect(map.getSizeObserver()).toBeUndefined();
    });
  });

  describe('Add layer', function () {
    it('should add layer', function () {
      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newVectorLayer());

      expect(map.unwrap().getLayers().getLength()).toEqual(1);
      expect(map.unwrap().getLayers().getArray()[0]).toBeInstanceOf(VectorImageLayer);
    });
  });

  describe('setActiveLayer()', () => {
    it('on wrong layer', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);

      expect(() => map.setActiveLayer(layer1)).toThrow(new Error('Layer does not belong to map'));
    });

    it('once', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
      const layer2 = LayerFactory.newVectorLayer();
      const layer3 = LayerFactory.newVectorLayer();
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);

      map.setActiveLayer(layer2);
      const layers = map.getLayers();
      expect(layers).toHaveLength(3);
      expect(map.unwrap().getLayers().get(LayerProperties.LastLayerChange)).toBeDefined();
      expect(layers[0].isActive()).toEqual(false);
      expect(layers[1].isActive()).toEqual(true);
      expect(layers[2].isActive()).toEqual(false);
    });

    it('twice', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
      const layer2 = LayerFactory.newVectorLayer();
      const layer3 = LayerFactory.newVectorLayer();
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);

      map.setActiveLayer(layer2);
      map.setActiveLayer(layer3);
      const layers = map.getLayers();
      expect(layers).toHaveLength(3);
      expect(map.unwrap().getLayers().get(LayerProperties.LastLayerChange)).toBeDefined();
      expect(layers[0].isActive()).toEqual(false);
      expect(layers[1].isActive()).toEqual(false);
      expect(layers[2].isActive()).toEqual(true);
    });
  });

  describe('getActiveLayer()', () => {
    it('should return undefined if no layer active', () => {
      const map = MapFactory.createNaked();

      expect(map.getActiveLayer()).toBeUndefined();
    });

    it('should return layer if one is active', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
      map.addLayer(layer1);
      map.setActiveLayer(layer1);

      expect(map.getActiveLayer()).toEqual(layer1);
    });
  });

  describe('getActiveVectorLayer()', () => {
    it('should return undefined if no layer active', () => {
      const map = MapFactory.createNaked();

      expect(map.getActiveVectorLayer()).toBeUndefined();
    });

    it('should return undefined if no vector layer active', () => {
      const map = MapFactory.createNaked();
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
      map.addLayer(layer);
      map.setActiveLayer(layer);

      expect(map.getActiveVectorLayer()).toBeUndefined();
    });

    it('should return layer if one vector is active', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newVectorLayer();
      map.addLayer(layer1);
      map.setActiveLayer(layer1);

      expect(map.getActiveVectorLayer()).toEqual(layer1);
    });
  });

  describe('Interaction handling', () => {
    it('setDefaultInteractions', () => {
      const map = MapFactory.createNaked();
      map.unwrap().addInteraction(new DragRotateAndZoom());

      map.setDefaultInteractions();

      expect(TestHelper.interactionNames(map.unwrap())).toEqual(['DoubleClickZoom', 'DragPan', 'KeyboardPan', 'MouseWheelZoom']);
    });

    it('cleanInteractions', () => {
      const map = MapFactory.createNaked();
      map.unwrap().addInteraction(new DragRotateAndZoom());

      map.cleanInteractions();

      expect(TestHelper.interactionNames(map.unwrap())).toEqual([]);
    });
  });

  describe('Tool handling', () => {
    it('Set tool should dispose previous tool', () => {
      // Prepare
      const map = MapFactory.createNaked();
      const layer = LayerFactory.newVectorLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      const previous = ToolRegistry.getById(MapTool.LineString);
      const disposeMock = jest.fn();
      previous.dispose = disposeMock;
      map.setTool(previous);

      // Act
      const tool = ToolRegistry.getById(MapTool.LineString);
      map.setTool(tool);

      // Assert
      expect(disposeMock).toHaveBeenCalledTimes(1);
    });

    it('Set tool should setup tool', () => {
      const map = MapFactory.createNaked();
      const layer = LayerFactory.newVectorLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      const tool = ToolRegistry.getById(MapTool.LineString);
      tool.setup = jest.fn();
      map.setTool(tool);

      expect(tool.setup).toHaveBeenCalled();
      expect(map.getCurrentTool()).toStrictEqual(tool);
    });

    it('Set active layer should set up default interactions (Vector -> Tile)', () => {
      // Prepare
      const map = MapFactory.createNaked();
      const vector = LayerFactory.newVectorLayer();
      const tile = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);

      map.addLayer(vector);
      map.addLayer(tile);
      map.setActiveLayer(vector);
      map.setTool(ToolRegistry.getById(MapTool.LineString));
      expect(TestHelper.interactionCount(map.unwrap(), 'Draw')).toEqual(1);

      // Act
      map.setActiveLayer(tile);

      // Assert
      expect(map.getCurrentTool()).toBeInstanceOf(LineStringTool);
      expect(TestHelper.interactionCount(map.unwrap(), 'Draw')).toEqual(0);
      expect(TestHelper.interactionNames(map.unwrap())).toEqual(['DoubleClickZoom', 'DragPan', 'KeyboardPan', 'MouseWheelZoom']);
    });

    it('Set active layer should enable interaction (Tile -> Vector)', () => {
      // Prepare
      const map = MapFactory.createNaked();
      const vector = LayerFactory.newVectorLayer();
      const tile = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);

      map.addLayer(vector);
      map.addLayer(tile);
      map.setActiveLayer(tile);
      map.setTool(ToolRegistry.getById(MapTool.LineString));
      expect(TestHelper.interactionCount(map.unwrap(), 'Draw')).toEqual(0);

      // Act
      map.setActiveLayer(vector);

      // Assert
      expect(map.getCurrentTool()).toBeInstanceOf(LineStringTool);
      expect(TestHelper.interactionCount(map.unwrap(), 'Draw')).toEqual(1);
    });
  });

  describe('containsCredentials()', () => {
    it('should return false', () => {
      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newVectorLayer());

      expect(map.containsCredentials()).toEqual(false);
    });

    it('should return true if XYZ layer', () => {
      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newXyzLayer('http://test-url'));

      expect(map.containsCredentials()).toEqual(true);
    });

    it('should return true if WMS layer with credentials', () => {
      const map = MapFactory.createNaked();
      map.addLayer(
        LayerFactory.newWmsLayer({
          remoteUrl: 'test-remoteUrl',
          remoteLayerName: 'test-remoteLayerName',
          auth: {
            username: 'username',
            password: 'password',
          },
        })
      );

      expect(map.containsCredentials()).toEqual(true);
    });
  });

  describe('getTextAttributions()', () => {
    it('with no layer', () => {
      const map = MapFactory.createNaked();

      expect(map.getTextAttributions()).toEqual([]);
    });

    it('with several layers', () => {
      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM));
      map.addLayer(LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenToner));

      expect(map.getTextAttributions()).toEqual(['© OpenStreetMap contributors.', 'Map tiles by Stamen Design, under CC BY 3.0.']);
    });
  });
});
