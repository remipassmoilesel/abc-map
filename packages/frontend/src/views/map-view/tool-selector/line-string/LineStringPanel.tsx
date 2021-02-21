import React, { Component, ReactNode } from 'react';
import { Logger } from '../../../../core/utils/Logger';
import ColorSelector from '../_common/color-selector/ColorSelector';
import StrokeWidthSelector from '../_common/StrokeWidthSelector';
import './LineStringPanel.scss';

const logger = Logger.get('LineStringPanel.tsx');

class LineStringPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={'abc-line-panel'}>
        <StrokeWidthSelector />
        <ColorSelector fillColors={false} />
      </div>
    );
  }
}

export default LineStringPanel;
