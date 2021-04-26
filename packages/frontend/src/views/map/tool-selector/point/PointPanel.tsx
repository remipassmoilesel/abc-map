import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import ColorSelector from '../_common/color-selector/ColorSelector';
import PointSizeSelector from './PointSizeSelector';
import PointIconSelector from './PointIconSelector';
import Cls from './PointPanel.module.scss';

const logger = Logger.get('PointPanel.tsx');

class PointPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.pointPanel}>
        <PointSizeSelector />
        <ColorSelector stroke={false} fillColor1={true} fillColor2={false} />
        <PointIconSelector />
      </div>
    );
  }
}

export default PointPanel;
