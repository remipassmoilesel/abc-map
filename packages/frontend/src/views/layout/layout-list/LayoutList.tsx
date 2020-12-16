import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { Logger } from '../../../core/utils/Logger';
import { AbcLayout } from '@abc-map/shared-entities';
import './LayoutList.scss';

const logger = Logger.get('LayoutList.tsx', 'info');

interface Props {
  activeLayout?: AbcLayout;
  layouts: AbcLayout[];
  onLayoutSelected?: (lay: AbcLayout) => void;
}

class LayoutList extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const items = this.props.layouts.map((lay) => {
      const classes = this.props.activeLayout?.id === lay.id ? 'item active' : 'item';
      return (
        <div key={lay.id} className={classes} onClick={() => this.onLayoutSelected(lay)}>
          <div>{lay.name}</div>
          <div>Format: {lay.format.name}</div>
          <div>
            Centre: {Math.round(lay.view.center[0])} {Math.round(lay.view.center[1])}
          </div>
          <div>1px = {Math.round(lay.view.resolution * 100) / 100}</div>
        </div>
      );
    });

    let message: ReactNode | undefined;
    if (!items.length) {
      message = 'Aucune page';
    }

    return (
      <div className={'abc-layout-list'}>
        <h3>Pages</h3>
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
