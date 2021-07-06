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
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import _ from 'lodash';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import Cls from './StrokeWidthSelector.module.scss';
import OptionRow from '../option-row/OptionRow';

const mapStateToProps = (state: MainState) => ({
  stroke: state.map.currentStyle.stroke,
});

const mapDispatchToProps = {
  setStrokeWidth: MapActions.setStrokeWidth,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class StrokeWidthSelector extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <OptionRow>
        <div className={'mr-2'}>Épaisseur:</div>
        <select value={this.props.stroke?.width} onChange={this.handleSelection} className={`form-control form-control-sm ${Cls.select}`}>
          {_.range(2, 21).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </OptionRow>
    );
  }

  private handleSelection = (ev: ChangeEvent<HTMLSelectElement>): void => {
    const { geo } = this.props.services;

    const width = Number(ev.target.value);
    this.props.setStrokeWidth(width);

    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        stroke: {
          ...style.stroke,
          width,
        },
      };
    });
  };
}

export default connector(withServices(StrokeWidthSelector));
