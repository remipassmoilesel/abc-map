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
import ColorPicker from '../../../../../components/color-picker/ColorPicker';
import * as _ from 'lodash';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import Cls from './TextFormat.module.scss';
import OptionRow from '../option-row/OptionRow';

const mapStateToProps = (state: MainState) => ({
  color: state.map.currentStyle.text?.color,
  size: state.map.currentStyle.text?.size,
});

const mapDispatchToProps = {
  setColor: MapActions.setTextColor,
  setSize: MapActions.setTextSize,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class TextFormat extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <>
        {/* Color */}
        <OptionRow>
          <div>Couleur:</div>
          <ColorPicker initialValue={this.props.color} onClose={this.handleColorSelected} />
        </OptionRow>

        {/* Size */}
        <OptionRow>
          <div>Taille:</div>
          <select onChange={this.handleSizeChange} value={this.props.size} className={`form-control form-control-sm ${Cls.select}`}>
            {_.range(5, 51).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </OptionRow>
      </>
    );
  }

  private handleColorSelected = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setColor(color);
    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        text: {
          ...style.text,
          color,
        },
      };
    });
  };

  private handleSizeChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
    const { geo } = this.props.services;

    const size = parseInt(ev.target.value);
    this.props.setSize(size);
    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        text: {
          ...style.text,
          size,
        },
      };
    });
  };
}

export default connector(withServices(TextFormat));
