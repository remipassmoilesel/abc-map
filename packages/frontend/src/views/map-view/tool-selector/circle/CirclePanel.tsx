import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import WidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import ColorSelector from '../_common/color-selector/ColorSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';
import Cls from './CirclePanel.module.scss';

const logger = Logger.get('CirclePanel.tsx');

class CirclePanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.circlePanel}>
        <WidthSelector />
        <ColorSelector fillColors={true} />
        <FillPatternSelector />
      </div>
    );
  }
}

export default CirclePanel;
