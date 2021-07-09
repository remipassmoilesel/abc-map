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
import Cls from './LegendItem.module.scss';
import { ServiceProps, withServices } from '../../../core/withServices';

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

class LegendItem extends Component<Props, {}> {
  public render(): ReactNode {
    const text = this.props.item.text;
    const upDisabled = this.props.isFirst;
    const downDisabled = this.props.isLast;

    return (
      <div className={Cls.legendItem} data-cy={'legend-item'}>
        <button className={'btn btn-outline-primary mr-2'} onClick={this.handleSymbolModalClick} data-cy={'legend-item-symbol'}>
          <i className={'fa fa-map-marker-alt'} />
        </button>
        <button onClick={this.handleDelete} title={'Supprimer'} className={'btn btn-outline-secondary mr-2'}>
          <i className={'fa fa-trash'} />
        </button>
        <button onClick={this.handleUp} disabled={upDisabled} title={'Monter'} className={'btn btn-outline-secondary mr-2'}>
          <i className={'fa fa-arrow-up'} />
        </button>
        <button onClick={this.handleDown} disabled={downDisabled} title={'Descendre'} className={'btn btn-outline-secondary mr-2'}>
          <i className={'fa fa-arrow-down'} />
        </button>
        <input type={'text'} value={text} onChange={this.handleTextChange} className={`form-control ${Cls.textField}`} />
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

export default withServices(LegendItem);
