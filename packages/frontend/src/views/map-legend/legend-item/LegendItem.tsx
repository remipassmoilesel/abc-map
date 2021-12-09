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
import { AbcLegendItem, Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../../i18n/i18n';
import { ServiceProps, withServices } from '../../../core/withServices';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import Cls from './LegendItem.module.scss';

const logger = Logger.get('LegendItem.tsx');

interface Props extends ServiceProps {
  item: AbcLegendItem;
  isFirst: boolean;
  isLast: boolean;
  onChange: (i: AbcLegendItem) => void;
  onDelete: (i: AbcLegendItem) => void;
  onUp: (i: AbcLegendItem) => void;
  onDown: (i: AbcLegendItem) => void;
}

const t = prefixedTranslation('MapLegendView:');

class LegendItem extends Component<Props, {}> {
  public render(): ReactNode {
    const text = this.props.item.text;
    const upDisabled = this.props.isFirst;
    const downDisabled = this.props.isLast;

    return (
      <div className={Cls.legendItem} data-cy={'legend-item'}>
        <button onClick={this.handleSymbolModalClick} title={t('Change_symbol')} className={'btn btn-outline-primary mr-2'} data-cy={'legend-item-symbol'}>
          <FaIcon icon={IconDefs.faMapMarkerAlt} size={'1.1rem'} />
        </button>
        <button onClick={this.handleUp} disabled={upDisabled} title={t('Move_up')} className={'btn btn-outline-secondary mr-2'}>
          <FaIcon icon={IconDefs.faArrowUp} size={'1.1rem'} />
        </button>
        <button onClick={this.handleDown} disabled={downDisabled} title={t('Move_down')} className={'btn btn-outline-secondary mr-2'}>
          <FaIcon icon={IconDefs.faArrowDown} size={'1.1rem'} />
        </button>
        <button onClick={this.handleDelete} title={t('Delete')} className={'btn btn-outline-secondary mr-2'}>
          <FaIcon icon={IconDefs.faTrash} size={'1.1rem'} />
        </button>
        <input type={'text'} value={text} onChange={this.handleTextChange} placeholder={t('Entry_name')} className={`form-control`} />
      </div>
    );
  }

  private handleTextChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const text = ev.target.value;

    this.props.onChange({
      ...this.props.item,
      text,
    });
  };

  private handleDelete = () => {
    this.props.onDelete(this.props.item);
  };

  private handleUp = () => {
    this.props.onUp(this.props.item);
  };

  private handleDown = () => {
    this.props.onDown(this.props.item);
  };

  private handleSymbolModalClick = () => {
    const { modals } = this.props.services;

    modals
      .legendSymbolPicker()
      .then((res) => {
        if (res.style) {
          this.props.onChange({
            ...this.props.item,
            symbol: {
              geomType: res.style.geomType,
              properties: res.style.properties,
            },
          });
        }
      })
      .catch((err) => logger.error('Modal failed: ', err));
  };
}

export default withTranslation()(withServices(LegendItem));
