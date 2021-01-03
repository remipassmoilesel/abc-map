import { MapFactory } from './MapFactory';
import { AbcProperties, LayerProperties, MapTool } from '@abc-map/shared-entities';
import { GeoService } from './GeoService';
import { Map } from 'ol';
import * as uuid from 'uuid';
import { logger, ManagedMap } from './ManagedMap';
import VectorLayer from 'ol/layer/Vector';
import { ToolRegistry } from './tools/ToolRegistry';
import { OlTestHelper } from '../utils/OlTestHelper';
import { Circle } from './tools/Circle';
import { None } from './tools/None';

logger.disable();

describe('ManagedMap', function () {
  let service: GeoService;

  beforeEach(() => {
    service = new GeoService();
  });

  it('reset() should remove all layers', () => {
    const map = MapFactory.createNaked();
    map.addLayer(service.newVectorLayer());

    map.reset();
    const layers = map.getLayers();
    expect(layers).toHaveLength(0);
  });

  describe('setTarget(), dispose()', () => {
    it('setTarget() should set proper target and add resize observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});

      const map = new ManagedMap(olMap);
      map.addLayer(service.newVectorLayer());
      map.setTarget(support);

      expect(olMap.getTarget()).toEqual(support);
      expect(map.getSizeObserver()).toBeDefined();
    });

    it('setTarget() should unset target and resize observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});

      const map = new ManagedMap(olMap);
      map.addLayer(service.newVectorLayer());
      map.setTarget(support);
      map.setTarget(undefined);

      expect(olMap.getTarget()).toEqual(undefined);
      expect(map.getSizeObserver()).toBeUndefined();
    });

    it('dispose() should dispose map and size observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});
      olMap.dispose = jest.fn();

      const map = new ManagedMap(olMap);
      map.addLayer(service.newVectorLayer());
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
      map.addLayer(service.newVectorLayer());

      expect(map.getInternal().getLayers().getLength()).toEqual(1);
      expect(map.getInternal().getLayers().getArray()[0]).toBeInstanceOf(VectorLayer);
    });

    it('should throw if layer is not managed', function () {
      expect.assertions(1);
      const map = MapFactory.createNaked();
      expect(() => {
        map.addLayer(new VectorLayer());
      }).toThrow('You must add custom properties to layers');
    });
  });

  describe('setActiveLayer()', () => {
    it('on wrong layer', () => {
      const map = MapFactory.createNaked();
      const layer1 = service.newOsmLayer();

      expect(() => {
        map.setActiveLayer(layer1);
      }).toThrow(new Error('Layer does not belong to map'));
    });

    it('once', () => {
      const map = MapFactory.createNaked();
      const layer1 = service.newOsmLayer();
      const layer2 = service.newVectorLayer();
      const layer3 = service.newVectorLayer();
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);

      map.setActiveLayer(layer2);
      const layers = map.getLayers();
      expect(layers).toHaveLength(3);
      expect(map.getInternal().getLayers().get(AbcProperties.LastLayerActive)).toEqual(layer2.get(LayerProperties.Id));
      expect(layers[0].get(LayerProperties.Active)).toEqual(false);
      expect(layers[1].get(LayerProperties.Active)).toEqual(true);
      expect(layers[2].get(LayerProperties.Active)).toEqual(false);
    });

    it('twice', () => {
      const map = MapFactory.createNaked();
      const layer1 = service.newOsmLayer();
      const layer2 = service.newVectorLayer();
      const layer3 = service.newVectorLayer();
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);

      map.setActiveLayer(layer2);
      map.setActiveLayer(layer3);
      const layers = map.getLayers();
      expect(layers).toHaveLength(3);
      expect(map.getInternal().getLayers().get(AbcProperties.LastLayerActive)).toEqual(layer3.get(LayerProperties.Id));
      expect(layers[0].get(LayerProperties.Active)).toEqual(false);
      expect(layers[1].get(LayerProperties.Active)).toEqual(false);
      expect(layers[2].get(LayerProperties.Active)).toEqual(true);
    });
  });

  describe('getActiveLayer()', () => {
    it('should return undefined if no layer active', () => {
      const map = MapFactory.createNaked();

      expect(map.getActiveLayer()).toBeUndefined();
    });

    it('should return layer if one is active', () => {
      const map = MapFactory.createNaked();
      const layer1 = service.newOsmLayer();
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
      const layer = service.newOsmLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      expect(map.getActiveVectorLayer()).toBeUndefined();
    });

    it('should return layer if one vector is active', () => {
      const map = MapFactory.createNaked();
      const layer1 = service.newVectorLayer();
      map.addLayer(layer1);
      map.setActiveLayer(layer1);

      expect(map.getActiveVectorLayer()).toEqual(layer1);
    });
  });

  describe('layersEquals()', () => {
    it('same ids, two active layer', () => {
      const map = MapFactory.createNaked();
      const id = uuid.v4();
      const layer1 = service.newVectorLayer();
      const layer2 = service.newVectorLayer();
      layer1.set(LayerProperties.Id, id);
      layer1.set(LayerProperties.Active, true);
      layer2.set(LayerProperties.Id, id);
      layer2.set(LayerProperties.Active, true);
      map.addLayer(layer1);

      const result = map.layersEquals([layer2]);
      expect(result).toBeTruthy();
    });

    it('same ids, one active layer', () => {
      const map = MapFactory.createNaked();
      const id = uuid.v4();
      const layer1 = service.newVectorLayer();
      const layer2 = service.newVectorLayer();
      layer1.set(LayerProperties.Id, id);
      layer1.set(LayerProperties.Active, true);
      layer2.set(LayerProperties.Id, id);
      layer2.set(LayerProperties.Active, false);
      map.addLayer(layer1);

      const result = map.layersEquals([layer2]);
      expect(result).toBeFalsy();
    });

    it('different ids, two inactive layer', () => {
      const map = MapFactory.createNaked();
      const layer1 = service.newVectorLayer();
      const layer2 = service.newVectorLayer();
      layer1.set(LayerProperties.Id, uuid.v4());
      layer1.set(LayerProperties.Active, false);
      layer2.set(LayerProperties.Id, uuid.v4());
      layer2.set(LayerProperties.Active, false);
      map.addLayer(layer1);

      const result = map.layersEquals([layer2]);
      expect(result).toBeFalsy();
    });
  });

  describe('Tool handling', () => {
    it('Set tool should dispose previous tool', () => {
      const map = MapFactory.createNaked();
      const layer = service.newVectorLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      const previous = ToolRegistry.getById(MapTool.Circle);
      previous.dispose = jest.fn();
      map.setTool(previous);

      const tool = ToolRegistry.getById(MapTool.Circle);
      map.setTool(tool);

      expect(previous.dispose).toHaveBeenCalledTimes(1);
    });

    it('Set tool should setup tool', () => {
      const map = MapFactory.createNaked();
      const layer = service.newVectorLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      const tool = ToolRegistry.getById(MapTool.Circle);
      tool.setup = jest.fn();
      map.setTool(tool);

      expect(tool.setup).toHaveBeenCalled();
      expect(map.getCurrentTool()).toStrictEqual(tool);
    });

    it('Set tool to NONE should disable interaction', () => {
      const map = MapFactory.createNaked();
      const layer = service.newVectorLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      map.setTool(ToolRegistry.getById(MapTool.Circle));
      map.setTool(ToolRegistry.getById(MapTool.None));

      expect(map.getCurrentTool()).toBeInstanceOf(None);
      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'Draw')).toEqual(0);
      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'Modify')).toEqual(0);
    });

    it('Set active layer should disable interaction (Vector -> Tile)', () => {
      const map = MapFactory.createNaked();
      const vector = service.newVectorLayer();
      const tile = service.newOsmLayer();
      map.addLayer(vector);
      map.addLayer(tile);
      map.setActiveLayer(vector);

      map.setTool(ToolRegistry.getById(MapTool.Circle));
      map.setActiveLayer(tile);

      expect(map.getCurrentTool()).toBeInstanceOf(Circle);
      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'Draw')).toEqual(0);
      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'Modify')).toEqual(0);
    });

    it('Set active layer should enable interaction (Tile -> Vector)', () => {
      const map = MapFactory.createNaked();
      const vector = service.newVectorLayer();
      const tile = service.newOsmLayer();
      map.addLayer(vector);
      map.addLayer(tile);
      map.setActiveLayer(tile);

      map.setTool(ToolRegistry.getById(MapTool.Circle));
      map.setActiveLayer(vector);

      expect(map.getCurrentTool()).toBeInstanceOf(Circle);
      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'Draw')).toEqual(1);
      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'Modify')).toEqual(1);
    });
  });
});
