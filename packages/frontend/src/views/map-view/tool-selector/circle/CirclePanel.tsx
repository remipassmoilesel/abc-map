import React, { Component, ReactNode } from 'react';
import { Logger } from '../../../../core/utils/Logger';
import WidthSelector from '../_common/StrokeWidthSelector';
import ColorSelector from '../_common/color-selector/ColorSelector';
import FillPatternSelector from '../_common/pattern-selector/FillPatternSelector';
import './CirclePanel.scss';

const logger = Logger.get('CirclePanel.tsx');

class CirclePanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={'abc-circle-panel'}>
        <WidthSelector />
        <ColorSelector fillColors={true} />
        <FillPatternSelector />
      </div>
    );
  }
}

export default CirclePanel;
