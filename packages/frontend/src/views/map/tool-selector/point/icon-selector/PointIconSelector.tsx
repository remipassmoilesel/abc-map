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

import React, { Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import OptionRow from '../../_common/option-row/OptionRow';
import PointIconPicker from '../../../../../components/icon-picker/PointIconPicker';
import { PointIconName } from '../../../../../assets/point-icons/PointIconName';

const mapStateToProps = (state: MainState) => ({
  point: state.map.currentStyle.point,
});

const mapDispatchToProps = {
  setPointIcon: MapActions.setPointIcon,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class PointIconSelector extends Component<Props, {}> {
  public render(): ReactNode {
    const selected = this.props.point?.icon as PointIconName;

    return (
      <OptionRow>
        <div className={'mr-2'}>Icône: </div>
        <PointIconPicker value={selected} onChange={this.handleSelection} />
      </OptionRow>
    );
  }

  private handleSelection = (icon: PointIconName): void => {
    const { geo } = this.props.services;

    this.props.setPointIcon(icon);

    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        point: {
          ...style.point,
          icon,
        },
      };
    });

    this.setState({ modal: false });
  };
}

export default connector(withServices(PointIconSelector));
