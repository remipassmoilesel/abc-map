import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/documentation';
import Cls from './EditPropertiesToolPanel.module.scss';

const logger = Logger.get('EditPropertiesPanel.tsx');

class EditPropertiesPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.selectionPanel}>
        <TipBubble id={ToolTips.EditProperties} label={'Aide'} className={'mx-3 mb-4'} />
      </div>
    );
  }
}

export default EditPropertiesPanel;
