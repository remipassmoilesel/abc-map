import React from 'react';
import MainMap, { LayerChangedHandler, logger } from './MainMap';
import { Map } from 'ol';
import { DrawingTool, DrawingTools } from '../../../core/map/DrawingTools';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { services } from '../../../core/Services';
import { Draw } from 'ol/interaction';
import { AbcProperties, LayerProperties } from '@abc-map/shared-entities';
import TileLayer from 'ol/layer/Tile';
import BaseLayer from 'ol/layer/Base';
import { TestHelper } from '../../../core/utils/TestHelper';

logger.disable();

describe('MainMap', () => {
  let container: HTMLDivElement;
  const mapService = services().map;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
  });

  describe('Initialization', () => {
    it('should initialize map correctly', () => {
      const map = new Map({});
      let component: MainMap | undefined;
      act(() => {
        component = renderMap(map, DrawingTools.None, container);
      });

      expect(map.getTarget()).toBeInstanceOf(HTMLDivElement);
      expect(map.getLayers().getListeners('propertychange')).toHaveLength(1);
      expect(getLayersFromMap(map)).toEqual([]);
      expect(component?.state.drawInteractions).toEqual([]);
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(0);
      expect(getInteractionCountFromMap(map, 'DragAndDrop')).toEqual(1);
    });

    it('should trigger onLayerChanged()', () => {
      const map = new Map({});

      const handler = jest.fn();
      act(() => {
        renderMap(map, DrawingTools.None, container, handler);
      });

      expect(handler.mock.calls.length).toBe(1);
      expect(handler.mock.calls[0][0]).toBeInstanceOf(Array);
      expect(handler.mock.calls[0][0]).toHaveLength(0);
    });
  });

  describe('Cleanup', () => {
    it('should remove listeners and interactions', () => {
      const map = new Map({});
      const vector = mapService.newVectorLayer();
      map.addLayer(vector);
      mapService.setActiveLayer(map, vector);

      act(() => {
        renderMap(map, DrawingTools.Point, container);
      });

      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(1);

      act(() => {
        unmountComponentAtNode(container);
      });

      expect(map.getTarget()).toBeUndefined();
      expect(map.getLayers().getListeners('propertychange')).toBeUndefined();
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(0);
      expect(getInteractionCountFromMap(map, 'DragAndDrop')).toEqual(0);
    });
  });

  it('Layer update should trigger onLayerChanged()', () => {
    const map = new Map({});

    const handler = jest.fn();
    act(() => {
      renderMap(map, DrawingTools.None, container, handler);
    });

    const tileLayer = mapService.newOsmLayer();
    act(() => {
      map.addLayer(tileLayer);
    });

    expect(handler.mock.calls.length).toBe(2);
    expect(handler.mock.calls[1][0]).toHaveLength(1);
    expect(handler.mock.calls[1][0][0]).toBeInstanceOf(TileLayer);

    act(() => {
      mapService.setActiveLayer(map, tileLayer);
    });

    expect(handler.mock.calls.length).toBe(3);
    expect(handler.mock.calls[2][0]).toHaveLength(1);
    expect(handler.mock.calls[2][0][0]).toBeInstanceOf(TileLayer);
  });

  it('Update layers of map should update component', () => {
    const map = new Map({});

    let component: MainMap | undefined;
    act(() => {
      component = renderMap(map, DrawingTools.None, container);
    });

    const osmLayer = mapService.newOsmLayer();
    act(() => {
      map.addLayer(osmLayer);
    });

    expect(getLayerNamesFromState(component)).toEqual(['TileLayer']);
    expect(getLayersFromState(component).map((lay) => lay.get(LayerProperties.Id))).toEqual([osmLayer.get(LayerProperties.Id)]);
  });

  describe('Tool handling', () => {
    it('should enable interaction on instantiation', () => {
      const map = new Map({});
      const vector = mapService.newVectorLayer();
      map.addLayer(vector);
      mapService.setActiveLayer(map, vector);

      act(() => {
        renderMap(map, DrawingTools.Point, container);
      });

      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(1);
    });

    it('Update tool when active layer is vector should enable interaction', () => {
      const map = new Map({});

      let component: MainMap | undefined;
      act(() => {
        component = renderMap(map, DrawingTools.None, container);
      });

      act(() => {
        const layer = mapService.newVectorLayer();
        map.addLayer(layer);
        mapService.setActiveLayer(map, layer);
      });

      act(() => {
        renderMap(map, DrawingTools.Point, container);
      });

      expect(component?.state.drawInteractions[0]).toBeInstanceOf(Draw);
      expect(map.get(AbcProperties.CurrentTool)).toEqual(DrawingTools.Point);
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(1);
    });

    it('Update tool to NONE should disable interaction', () => {
      const map = new Map({});

      let component: MainMap | undefined;
      act(() => {
        component = renderMap(map, DrawingTools.None, container);
      });

      act(() => {
        const layer = mapService.newVectorLayer();
        map.addLayer(layer);
        mapService.setActiveLayer(map, layer);
      });

      act(() => {
        renderMap(map, DrawingTools.Point, container);
      });

      act(() => {
        renderMap(map, DrawingTools.None, container);
      });

      expect(component?.state.drawInteractions).toEqual([]);
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(0);
      expect(map.get(AbcProperties.CurrentTool)).toEqual(DrawingTools.None);
    });

    it('Update active layer should disable interaction (Vector -> Predefined)', () => {
      const map = new Map({});

      let component: MainMap | undefined;
      act(() => {
        component = renderMap(map, DrawingTools.None, container);
      });

      act(() => {
        map.addLayer(mapService.newOsmLayer());
        const vector = mapService.newVectorLayer();
        map.addLayer(vector);
        mapService.setActiveLayer(map, vector);
      });

      act(() => {
        renderMap(map, DrawingTools.Point, container);
      });

      act(() => {
        const layers = mapService.getManagedLayers(map);
        mapService.setActiveLayer(map, layers[0]);
      });

      expect(component?.state.drawInteractions).toEqual([]);
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(0);
      expect(map.get(AbcProperties.CurrentTool)).toEqual(DrawingTools.None);
    });

    it('Update active layer should enable interaction (Predefined -> Vector)', () => {
      const map = new Map({});

      let component: MainMap | undefined;
      act(() => {
        component = renderMap(map, DrawingTools.Point, container);
      });

      act(() => {
        map.addLayer(mapService.newOsmLayer());
        const vector = mapService.newVectorLayer();
        map.addLayer(vector);
        const layers = mapService.getManagedLayers(map);
        mapService.setActiveLayer(map, layers[0]);
      });

      expect(component?.state.drawInteractions).toEqual([]);
      expect(getInteractionNamesFromMap(map)).not.toContain('Draw');

      act(() => {
        const layers = mapService.getManagedLayers(map);
        mapService.setActiveLayer(map, layers[1]);
      });

      expect(component?.state.drawInteractions).toBeDefined();
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(1);
      expect(map.get(AbcProperties.CurrentTool)).toEqual(DrawingTools.Point);
    });
  });
});

/**
 * Render map with specified parameters then return a reference to component.
 *
 */
function renderMap(map: Map, tool: DrawingTool, container: HTMLElement, layerHandler?: LayerChangedHandler): MainMap {
  // Note: ReactDOM.render() function signature is broken
  return ReactDOM.render(<MainMap map={map} drawingTool={tool} onLayersChanged={layerHandler} currentStyle={TestHelper.sampleStyles()} />, container) as any;
}

function getLayersFromMap(map?: Map): string[] {
  expect(map).toBeDefined();
  return (map as Map)
    .getLayers()
    .getArray()
    .map((lay) => lay.constructor.name);
}

function getInteractionNamesFromMap(map?: Map): string[] {
  expect(map).toBeDefined();
  return (map as Map)
    .getInteractions()
    .getArray()
    .map((inter) => inter.constructor.name);
}

function getInteractionCountFromMap(map: Map, name: string): number {
  expect(map).toBeDefined();
  return (map as Map)
    .getInteractions()
    .getArray()
    .filter((inter) => inter.constructor.name === name).length;
}

function getLayersFromState(map?: MainMap): BaseLayer[] {
  expect(map).toBeDefined();
  return (map as MainMap).state.layers;
}

function getLayerNamesFromState(map?: MainMap): string[] {
  expect(map).toBeDefined();
  return (map as MainMap).state.layers.map((lay) => lay.constructor.name);
}
