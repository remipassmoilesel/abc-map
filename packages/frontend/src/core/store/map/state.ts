import { DrawingTool, DrawingTools } from '../../map/DrawingTools';
import { Map } from 'ol';
import { MapFactory } from '../../map/MapFactory';
import { AbcWindow } from '../../AbcWindow';
import { LayerFactory } from '../../map/LayerFactory';
import { AbcStyle } from '../../map/AbcStyle';

export interface MapState {
  /**
   * Current drawing tool selected
   */
  drawingTool?: DrawingTool;
  /**
   * <p>Reference to the main map, containing present project layers and features.</p>
   *
   * <p>This reference will be set with a new map at store startup.</p>
   *
   * <p>Warning: Map and layers ara mutable, so no notifications should be expected from this state</p>
   */
  mainMap: Map;

  currentStyle: AbcStyle;
}

export const mapInitialState: MapState = {
  drawingTool: DrawingTools.None,
  mainMap: newMap(),
  currentStyle: {
    fill: {
      color: '#ffffff',
    },
    stroke: {
      color: '#005cc1',
      width: 5,
    },
  },
};

// TODO: better place for init, activate vector on startup
// TODO: see map refactoring, create a map wrapper
function newMap(): Map {
  const map = MapFactory.newDefaultMap();
  map.addLayer(LayerFactory.newOsmLayer());
  map.addLayer(LayerFactory.newVectorLayer());
  return map;
}

/**
 * Store reference to main map in window object, for debug purposes only
 */
function initMapRef() {
  const _window: AbcWindow = window as any;
  _window.abc = {
    ..._window.abc,
    mainMap: mapInitialState.mainMap,
  };
}
initMapRef();
