import { FillPatterns } from '@abc-map/shared';

export const DefaultDrawingStyle = {
  fill: {
    color1: 'rgba(18,90,147,0.30)',
    color2: 'rgba(255,255,255,0.60)',
    pattern: FillPatterns.HatchingObliqueRight,
  },
  stroke: {
    color: 'rgba(18,90,147,0.60)',
    width: 3,
  },
  text: {
    color: 'rgba(18,90,147,1)',
    font: 'AbcCantarell',
    size: 30,
    offsetX: 15,
    offsetY: 15,
    rotation: 0,
  },
  point: {
    icon: 'twbs/geo-alt-fill.inline.svg',
    size: 30,
    color: 'rgba(18,90,147,0.9)',
  },
};
