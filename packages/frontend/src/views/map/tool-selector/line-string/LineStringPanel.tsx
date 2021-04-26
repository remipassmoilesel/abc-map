import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import ColorSelector from '../_common/color-selector/ColorSelector';
import StrokeWidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import Cls from './LineStringPanel.module.scss';

const logger = Logger.get('LineStringPanel.tsx');

class LineStringPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.linePanel}>
        <StrokeWidthSelector />
        <ColorSelector stroke={true} />
      </div>
    );
  }
}

export default LineStringPanel;
