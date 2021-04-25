import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import WidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import ColorSelector from '../_common/color-selector/ColorSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';
import Cls from './Rectangle.module.scss';

const logger = Logger.get('RectanglePanel.tsx');

class RectanglePanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.rectanglePanel}>
        <WidthSelector />
        <ColorSelector stroke={true} fillColor1={true} fillColor2={true} />
        <FillPatternSelector />
      </div>
    );
  }
}

export default RectanglePanel;
