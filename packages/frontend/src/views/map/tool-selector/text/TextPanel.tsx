import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import TextFormat from '../_common/text-format/TextFormat';
import './TextPanel.scss';

const logger = Logger.get('TextPanel.tsx');

class TextPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={'abc-text-panel'}>
        <TextFormat />
      </div>
    );
  }
}

export default TextPanel;
