import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { AbcLayout } from '@abc-map/shared-entities';
import Cls from './LayoutList.module.scss';
import LayoutListItem from './LayoutListItem';

const logger = Logger.get('LayoutList.tsx', 'warn');

interface Props {
  active?: AbcLayout;
  layouts: AbcLayout[];
  onSelected: (lay: AbcLayout) => void;
  onDeleted: (lay: AbcLayout) => void;
}

class LayoutList extends Component<Props, {}> {
  public render(): ReactNode {
    const handleSelected = this.props.onSelected;
    const handleDeleted = this.props.onDeleted;
    const items = this.props.layouts.map((lay) => {
      const active = this.props.active?.id === lay.id;
      return <LayoutListItem key={lay.id} active={active} layout={lay} onSelected={handleSelected} onDeleted={handleDeleted} />;
    });

    let message: ReactNode | undefined;
    if (!items.length) {
      message = 'Les pages sont affichées ici.';
    }

    return (
      <div className={Cls.layoutList} data-cy={'layout-list'}>
        <div className={'mx-4 font-weight-bold'}>Pages</div>
        {items}
        {message && (
          <div className={'m-4'} data-cy={'no-layout'}>
            {message}
          </div>
        )}
      </div>
    );
  }
}

export default LayoutList;
