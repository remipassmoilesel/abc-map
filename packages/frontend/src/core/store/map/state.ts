import { AbcStyle } from '../../geo/features/AbcStyle';
import { MapTool } from '@abc-map/shared-entities';

export interface MapState {
  /**
   * Current tool selected
   */
  tool: MapTool;

  currentStyle: AbcStyle;
}

export const mapInitialState: MapState = {
  tool: MapTool.None,
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
