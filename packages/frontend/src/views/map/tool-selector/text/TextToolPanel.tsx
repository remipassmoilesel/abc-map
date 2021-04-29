import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import TextFormat from '../_common/text-format/TextFormat';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/documentation';
import './TextToolPanel.scss';

const logger = Logger.get('TextToolPanel.tsx');

class TextToolPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={'abc-text-panel'}>
        <TipBubble id={ToolTips.Text} label={'Aide'} className={'mx-3 mb-4'} />
        <TextFormat />
      </div>
    );
  }
}

export default TextToolPanel;
