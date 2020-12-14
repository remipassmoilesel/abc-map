import React from 'react';
import MainMap, { LayerChangedHandler, logger } from './MainMap';
import { Map } from 'ol';
import { DrawingTool, DrawingTools } from '../../../core/map/DrawingTools';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { services } from '../../../core/Services';
import { Draw } from 'ol/interaction';
import { AbcProperties } from '../../../core/map/AbcProperties';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

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

  it('First render should initialize map correctly', () => {
    let component: MainMap | undefined;
    act(() => {
      component = renderMap(DrawingTools.None, container);
    });

    const map = component?.state.map as Map;
    expect(map).toBeInstanceOf(Map);
    expect(getLayersFromMap(map)).toEqual(['TileLayer']);
    expect(component?.state.drawInteraction).toBeUndefined();
    expect(getInteractionCountFromMap(map, 'Draw')).toEqual(0);
  });

  it('First render should trigger onLayerChanged()', () => {
    const handler = jest.fn();
    act(() => {
      renderMap(DrawingTools.None, container, handler);
    });

    expect(handler.mock.calls.length).toBe(1);
    expect(handler.mock.calls[0][0]).toBeInstanceOf(Array);
    expect(handler.mock.calls[0][0]).toHaveLength(1);
    expect(handler.mock.calls[0][0][0]).toBeInstanceOf(TileLayer);
  });

  it('Layer update should trigger onLayerChanged()', () => {
    const handler = jest.fn();
    let component: MainMap | undefined;
    act(() => {
      component = renderMap(DrawingTools.None, container, handler);
    });

    const map = component?.state.map as Map;
    const vectorLayer = mapService.newVectorLayer();
    act(() => {
      map.addLayer(vectorLayer);
    });

    expect(handler.mock.calls.length).toBe(2);
    expect(handler.mock.calls[1][0]).toHaveLength(2);
    expect(handler.mock.calls[1][0][0]).toBeInstanceOf(TileLayer);
    expect(handler.mock.calls[1][0][1]).toBeInstanceOf(VectorLayer);

    act(() => {
      mapService.setActiveLayer(map, vectorLayer);
    });

    expect(handler.mock.calls.length).toBe(3);
    expect(handler.mock.calls[2][0]).toHaveLength(2);
    expect(handler.mock.calls[2][0][0]).toBeInstanceOf(TileLayer);
    expect(handler.mock.calls[2][0][1]).toBeInstanceOf(VectorLayer);
  });

  it('Update layers of map should update component', () => {
    let component: MainMap | undefined;
    act(() => {
      component = renderMap(DrawingTools.None, container);
    });

    const map = component?.state.map as Map;
    act(() => {
      map.addLayer(mapService.newVectorLayer());
    });

    expect(getLayersFromComponent(component)).toEqual(['TileLayer', 'VectorLayer']);
  });

  describe('Tool handling', () => {
    it('Update tool when active layer is vector should enable interaction', () => {
      let component: MainMap | undefined;
      act(() => {
        component = renderMap(DrawingTools.None, container);
      });

      const map = component?.state.map as Map;
      act(() => {
        const layer = mapService.newVectorLayer();
        map.addLayer(layer);
        mapService.setActiveLayer(map, layer);
      });

      act(() => {
        renderMap(DrawingTools.Point, container);
      });

      expect(component?.state.drawInteraction).toBeInstanceOf(Draw);
      expect(map.get(AbcProperties.CurrentTool)).toEqual(DrawingTools.Point);
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(1);
    });

    it('Update tool to NONE should disable interaction', () => {
      let component: MainMap | undefined;
      act(() => {
        component = renderMap(DrawingTools.None, container);
      });

      const map = component?.state.map as Map;
      act(() => {
        const layer = mapService.newVectorLayer();
        map.addLayer(layer);
        mapService.setActiveLayer(map, layer);
      });

      act(() => {
        renderMap(DrawingTools.Point, container);
      });

      act(() => {
        renderMap(DrawingTools.None, container);
      });

      expect(component?.state.drawInteraction).toBeUndefined();
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(0);
      expect(map.get(AbcProperties.CurrentTool)).toEqual(DrawingTools.None);
    });

    it('Update active layer should disable interaction (Vector -> Predefined)', () => {
      let component: MainMap | undefined;
      act(() => {
        component = renderMap(DrawingTools.None, container);
      });

      const map = component?.state.map as Map;
      act(() => {
        const layer = mapService.newVectorLayer();
        map.addLayer(layer);
        mapService.setActiveLayer(map, layer);
      });

      act(() => {
        renderMap(DrawingTools.Point, container);
      });

      act(() => {
        const layers = mapService.getManagedLayers(map);
        mapService.setActiveLayer(map, layers[0]);
      });

      expect(component?.state.drawInteraction).toBeUndefined();
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(0);
      expect(map.get(AbcProperties.CurrentTool)).toEqual(DrawingTools.None);
    });

    it('Update active layer should enable interaction (Predefined -> Vector)', () => {
      let component: MainMap | undefined;
      act(() => {
        component = renderMap(DrawingTools.Point, container);
      });

      const map = component?.state.map as Map;
      act(() => {
        const layer = mapService.newVectorLayer();
        map.addLayer(layer);
        const layers = mapService.getManagedLayers(map);
        mapService.setActiveLayer(map, layers[0]);
      });

      expect(component?.state.drawInteraction).toBeUndefined();
      expect(getInteractionsFromMap(map)).not.toContain('Draw');

      act(() => {
        const layers = mapService.getManagedLayers(map);
        mapService.setActiveLayer(map, layers[1]);
      });

      expect(component?.state.drawInteraction).toBeDefined();
      expect(getInteractionCountFromMap(map, 'Draw')).toEqual(1);
      expect(map.get(AbcProperties.CurrentTool)).toEqual(DrawingTools.Point);
    });
  });
});

/**
 * Render map with specified parameters then return a reference to component.
 *
 */
function renderMap(tool: DrawingTool, container: HTMLElement, layerHandler?: LayerChangedHandler): MainMap {
  // Note: render() function signature is broken
  return ReactDOM.render(<MainMap drawingTool={tool} onLayersChanged={layerHandler} />, container) as any;
}

function getLayersFromMap(map?: Map): string[] {
  expect(map).toBeDefined();
  return (map as Map)
    .getLayers()
    .getArray()
    .map((lay) => lay.constructor.name);
}

function getInteractionsFromMap(map?: Map): string[] {
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

function getLayersFromComponent(map?: MainMap): string[] {
  expect(map).toBeDefined();
  return (map as MainMap).state.layers.map((lay) => lay.constructor.name);
}
