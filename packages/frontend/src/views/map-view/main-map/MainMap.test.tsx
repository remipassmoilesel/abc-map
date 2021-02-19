import React from 'react';
import MainMap, { logger } from './MainMap';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { OlTestHelper } from '../../../core/utils/OlTestHelper';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';

logger.disable();

describe('MainMap', () => {
  let container: HTMLDivElement;
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
      const map = MapFactory.createNaked();
      const internal = map.unwrap();
      act(() => {
        renderMap(map, container);
      });

      expect(internal.getTarget()).toBeInstanceOf(HTMLDivElement);
      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'DragAndDrop')).toEqual(1);
    });
  });

  describe('Cleanup', () => {
    it('should remove listeners and interactions', () => {
      const map = MapFactory.createNaked();
      const internal = map.unwrap();
      const vector = LayerFactory.newVectorLayer();
      map.addLayer(vector);
      map.setActiveLayer(vector);

      act(() => {
        renderMap(map, container);
      });

      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'DragAndDrop')).toEqual(1);

      act(() => {
        unmountComponentAtNode(container);
      });

      expect(internal.getTarget()).toBeUndefined();
      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'DragAndDrop')).toEqual(0);
    });
  });
});

/**
 * Render map with specified parameters then return a reference to component.
 *
 */
function renderMap(map: MapWrapper, container: HTMLElement): MainMap {
  // Note: ReactDOM.render() function signature is broken
  return ReactDOM.render(<MainMap map={map} />, container) as any;
}
