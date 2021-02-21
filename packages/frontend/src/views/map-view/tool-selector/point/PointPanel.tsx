import React, { Component, ReactNode } from 'react';
import { Logger } from '../../../../core/utils/Logger';
import ColorSelector from '../_common/color-selector/ColorSelector';
import StrokeWidthSelector from '../_common/StrokeWidthSelector';
import './PointPanel.scss';

const logger = Logger.get('PointPanel.tsx');

class PointPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={'abc-point-panel'}>
        <StrokeWidthSelector />
        <ColorSelector fillColors={false} />
      </div>
    );
  }
}

export default PointPanel;
