import React from 'react';
import MainMap, { logger } from './MainMap';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { services } from '../../../core/Services';
import { ManagedMap } from '../../../core/map/ManagedMap';
import { MapFactory } from '../../../core/map/MapFactory';
import { OlTestHelper } from '../../../core/utils/OlTestHelper';

logger.disable();

describe('MainMap', () => {
  let container: HTMLDivElement;
  const mapService = services().geo;
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
      const internal = map.getInternal();
      act(() => {
        renderMap(map, container);
      });

      expect(internal.getTarget()).toBeInstanceOf(HTMLDivElement);
      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'DragAndDrop')).toEqual(1);
    });
  });

  describe('Cleanup', () => {
    it('should remove listeners and interactions', () => {
      const map = MapFactory.createNaked();
      const internal = map.getInternal();
      const vector = mapService.newVectorLayer();
      map.addLayer(vector);
      map.setActiveLayer(vector);

      act(() => {
        renderMap(map, container);
      });

      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'DragAndDrop')).toEqual(1);

      act(() => {
        unmountComponentAtNode(container);
      });

      expect(internal.getTarget()).toBeUndefined();
      expect(OlTestHelper.getInteractionCount(map.getInternal(), 'DragAndDrop')).toEqual(0);
    });
  });
});

/**
 * Render map with specified parameters then return a reference to component.
 *
 */
function renderMap(map: ManagedMap, container: HTMLElement): MainMap {
  // Note: ReactDOM.render() function signature is broken
  return ReactDOM.render(<MainMap map={map} />, container) as any;
}
