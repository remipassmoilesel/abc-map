import React, { Component, ReactNode } from 'react';
import { Logger } from '../../../../core/utils/Logger';
import WidthSelector from '../_common/StrokeWidthSelector';
import ColorSelector from '../_common/color-selector/ColorSelector';
import FillPatternSelector from '../_common/pattern-selector/FillPatternSelector';
import './PolygonPanel.scss';

const logger = Logger.get('PolygonPanel');

class PolygonPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={'abc-polygon-panel'}>
        <WidthSelector />
        <ColorSelector withFillColors={true} />
        <FillPatternSelector />
      </div>
    );
  }
}

export default PolygonPanel;
