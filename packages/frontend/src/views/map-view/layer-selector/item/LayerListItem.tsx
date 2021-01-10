import React, { Component, ReactNode } from 'react';
import { Logger } from '../../../../core/utils/Logger';
import { AbcLayerMetadata } from '@abc-map/shared-entities';
import './LayerListItem.scss';

const logger = Logger.get('LayerListItem.tsx', 'info');

interface Props {
  metadata: AbcLayerMetadata;
  onClick: (id: string) => void;
}

class LayerListItem extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const meta = this.props.metadata;
    const selectedClass = meta.active ? 'active' : '';
    const icon = meta.visible ? 'fa-eye' : 'fa-eye-slash';
    return (
      <div onClick={() => this.props.onClick(meta.id)} className={`abc-layer-item ${selectedClass}`}>
        <i className={`fa ${icon} mr-2`} />
        {meta.name}
      </div>
    );
  }
}

export default LayerListItem;
