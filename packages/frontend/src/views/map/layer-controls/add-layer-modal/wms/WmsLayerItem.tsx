import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { WmsLayer } from '../../../../../core/geo/WmsCapabilities';
import './WmsLayerItem.scss';

const logger = Logger.get('WmsLayerItem.tsx');

interface Props {
  layer: WmsLayer;
  selected: boolean;
  onSelected: (lay: WmsLayer) => void;
}

class WmsLayerItem extends Component<Props, {}> {
  public render(): ReactNode {
    const layer = this.props.layer;
    const classes = this.props.selected ? 'abc-wms-layer-item selected' : 'abc-wms-layer-item';
    return (
      <div className={classes} onClick={this.handleClick} data-cy={'wms-layer-item'}>
        <div>{layer.Name}</div>
        <small>{layer.Abstract}</small>
      </div>
    );
  }

  private handleClick = () => {
    this.props.onSelected(this.props.layer);
  };
}

export default WmsLayerItem;
