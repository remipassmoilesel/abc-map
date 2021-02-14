import { AbcStyleProperties } from '../../geo/style/AbcStyleProperties';
import { MapTool } from '@abc-map/shared-entities';

export interface MapState {
  /**
   * Current tool selected
   */
  tool: MapTool;

  currentStyle: AbcStyleProperties;
}

export const mapInitialState: MapState = {
  tool: MapTool.None,
  currentStyle: {
    fill: {
      color1: '#FFFFFF',
      color2: '#005cc1',
    },
    stroke: {
      color: '#3F37C9',
      width: 5,
    },
  },
};
