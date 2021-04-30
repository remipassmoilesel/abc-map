import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { BaseMetadata } from '@abc-map/shared-entities';
import Cls from './LayerListItem.module.scss';

const logger = Logger.get('LayerListItem.tsx', 'info');

interface Props {
  metadata: BaseMetadata;
  onClick: (id: string) => void;
}

class LayerListItem extends Component<Props, {}> {
  public render(): ReactNode {
    const meta = this.props.metadata;
    const selectedClass = meta.active ? Cls.active : '';
    const dataLayer = meta.active ? 'active' : `inactive`;
    const icon = meta.visible ? 'fa-eye' : 'fa-eye-slash';
    return (
      <div onClick={() => this.props.onClick(meta.id)} className={`${Cls.listItem} ${selectedClass}`} data-cy={'list-item'} data-layer={dataLayer}>
        <i className={`fa ${icon} mr-2`} />
        {meta.name}
      </div>
    );
  }
}

export default LayerListItem;
