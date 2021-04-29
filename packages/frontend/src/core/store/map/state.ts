import { FeatureStyle } from '../../geo/style/FeatureStyle';
import { MapTool } from '@abc-map/frontend-commons';
import { PointIcons } from '../../geo/style/PointIcons';

export interface MapState {
  /**
   * Current tool selected
   */
  tool: MapTool;

  currentStyle: FeatureStyle;
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
    text: {
      color: '#3F37C9',
      font: 'sans-serif',
      size: 30,
    },
    point: {
      icon: PointIcons.Circle,
      size: 5,
      color: '#3F37C9',
    },
  },
};
