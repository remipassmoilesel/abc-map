/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { ChangeEvent, Component, ReactNode } from 'react';
import { AbcLegend, AbcLegendItem, Logger } from '@abc-map/shared';
import LegendItem from '../legend-item/LegendItem';
import NewLegendItemForm from './NewLegendItemForm';
import Cls from './LegendUpdateForm.module.scss';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('LegendUpdateForm.tsx');

interface Props {
  legend: AbcLegend;
  onSizeChanged: (width: number, height: number) => void;
  onNewItem: (item: AbcLegendItem) => void;
  onItemChanged: (item: AbcLegendItem) => void;
  onItemDeleted: (item: AbcLegendItem) => void;
  onItemUp: (item: AbcLegendItem) => void;
  onItemDown: (item: AbcLegendItem) => void;
}

const t = prefixedTranslation('MapLegendView:');

class LegendUpdateForm extends Component<Props, {}> {
  public render(): ReactNode {
    const items = this.props.legend.items;
    const width = this.props.legend.width;
    const height = this.props.legend.height;

    const handleChanged = this.props.onItemChanged;
    const handleDelete = this.props.onItemDeleted;
    const handleUp = this.props.onItemUp;
    const handleDown = this.props.onItemDown;

    return (
      <div className={Cls.updateForm}>
        {!items.length && <div className={'my-4'}>{t('No_entry')}</div>}

        <div className={'mt-4'}>
          {items.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === items.length - 1;
            return (
              <LegendItem
                key={item.id}
                item={item}
                isFirst={isFirst}
                isLast={isLast}
                onChange={handleChanged}
                onDelete={handleDelete}
                onUp={handleUp}
                onDown={handleDown}
              />
            );
          })}
        </div>

        <NewLegendItemForm onSubmit={this.handleNewItem} />

        <div className={'d-flex flex-row align-items-center my-3'}>
          <span className={'mr-3'}>{t('Width')}:</span> <input type={'number'} value={width} className={'form-control'} onChange={this.handleWidthChanged} />
          <span className={'mx-3'}>{t('Height')}:</span> <input type={'number'} value={height} className={'form-control'} onChange={this.handleHeightChanged} />
          <span className={'ml-3'}>({t('pixels')})</span>
        </div>
      </div>
    );
  }

  private handleWidthChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const width = Math.round(parseInt(ev.target.value));
    this.props.onSizeChanged(width, this.props.legend.height);
  };

  private handleHeightChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const height = Math.round(parseInt(ev.target.value));
    this.props.onSizeChanged(this.props.legend.width, height);
  };

  private handleNewItem = (item: AbcLegendItem) => {
    this.props.onNewItem(item);
  };
}

export default withTranslation()(LegendUpdateForm);
