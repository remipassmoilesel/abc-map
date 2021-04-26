import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { AbcLayout } from '@abc-map/shared-entities';
import Cls from './LayoutListItem.module.scss';

const logger = Logger.get('LayoutListItem.tsx', 'warn');

interface Props {
  active: boolean;
  layout: AbcLayout;
  onSelected: (lay: AbcLayout) => void;
  onDeleted: (lay: AbcLayout) => void;
}

class LayoutListItem extends Component<Props, {}> {
  public render(): ReactNode {
    const layout = this.props.layout;
    const classes = this.props.active ? `${Cls.item} ${Cls.active}` : Cls.item;
    return (
      <div className={classes}>
        <div className={'d-flex justify-content-between align-items-center'}>
          <div onClick={this.handleSelected} className={'cursor-pointer'} data-cy={'list-item'}>
            {layout.name}
          </div>
          <button className={'btn btn-sm btn-link'} onClick={this.handleDeleted}>
            <i className={'fa fa-trash'} />
          </button>
        </div>

        <div onClick={this.handleSelected} className={'cursor-pointer'}>
          Format: {layout.format.name}
        </div>
      </div>
    );
  }

  private handleSelected = (): void => {
    this.props.onSelected(this.props.layout);
  };

  private handleDeleted = (): void => {
    this.props.onDeleted(this.props.layout);
  };
}

export default LayoutListItem;
