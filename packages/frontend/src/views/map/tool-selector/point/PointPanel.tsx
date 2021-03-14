import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import ColorSelector from '../_common/color-selector/ColorSelector';
import StrokeWidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import Cls from './PointPanel.module.scss';
import PointSizeSelector from './PointSizeSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';

const logger = Logger.get('PointPanel.tsx');

class PointPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.pointPanel}>
        <PointSizeSelector />
        <StrokeWidthSelector />
        <ColorSelector fillColors={true} />
        <FillPatternSelector />
      </div>
    );
  }
}

export default PointPanel;
