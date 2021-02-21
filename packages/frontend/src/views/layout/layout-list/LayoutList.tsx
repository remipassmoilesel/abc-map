import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { Logger } from '../../../core/utils/Logger';
import { AbcLayout } from '@abc-map/shared-entities';
import './LayoutList.scss';

const logger = Logger.get('LayoutList.tsx', 'warn');

interface Props {
  activeLayout?: AbcLayout;
  layouts: AbcLayout[];
  onLayoutSelected?: (lay: AbcLayout) => void;
}

class LayoutList extends Component<Props, {}> {
  private services = services();

  public render(): ReactNode {
    const items = this.props.layouts.map((lay) => {
      const classes = this.props.activeLayout?.id === lay.id ? 'item active' : 'item';
      return (
        <div key={lay.id} className={classes} onClick={() => this.onLayoutSelected(lay)}>
          <div>{lay.name}</div>
          <div>Format: {lay.format.name}</div>
        </div>
      );
    });

    let message: ReactNode | undefined;
    if (!items.length) {
      message = 'Aucune page';
    }

    return (
      <div className={'abc-layout-list'}>
        <div className={'mt-3 mb-3'}>Pages du projet</div>
        {items}
        {message}
      </div>
    );
  }

  private onLayoutSelected(layout: AbcLayout): void {
    this.props.onLayoutSelected && this.props.onLayoutSelected(layout);
  }
}

export default LayoutList;
