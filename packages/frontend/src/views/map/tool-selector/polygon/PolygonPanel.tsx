import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import WidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import ColorSelector from '../_common/color-selector/ColorSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';
import Cls from './PolygonPanel.module.scss';

const logger = Logger.get('PolygonPanel.tsx');

class PolygonPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.polygonPanel}>
        <WidthSelector />
        <ColorSelector fillColors={true} />
        <FillPatternSelector />
      </div>
    );
  }
}

export default PolygonPanel;
