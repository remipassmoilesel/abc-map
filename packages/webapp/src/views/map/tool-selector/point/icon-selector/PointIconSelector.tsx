/**
 * Copyright © 2026 Rémi Pace.
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

import type { ReactNode } from 'react';
import React, { Component } from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type { MainState } from '../../../../../store/reducer';
import { MapActions } from '../../../../../store/map/actions';
import type { ServiceProps } from '../../../../../core/withServices';
import { withServices } from '../../../../../core/withServices';
import OptionRow from '../../_common/option-row/OptionRow';
import { PointIconPicker } from '../../../../../components/point-icon-picker/PointIconPicker';
import type { IconName } from '@abc-map/point-icons';
import type { WithTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';

const mapStateToProps = (state: MainState) => ({
  point: state.map.currentStyle.point,
});

const mapDispatchToProps = {
  setPointIcon: MapActions.setPointIcon,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps & WithTranslation;

class PointIconSelector extends Component<Props, unknown> {
  public render(): ReactNode {
    const selected = this.props.point?.icon as IconName;
    const lang = this.props.i18n.language;
    const t = this.props.i18n.getFixedT(lang, 'MapView');

    return (
      <OptionRow>
        <div className={'mr-2'}>{t('Icon')}: </div>
        <PointIconPicker value={selected} onChange={this.handleSelection} />
      </OptionRow>
    );
  }

  private handleSelection = (icon: IconName): void => {
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

export default withTranslation()(connector(withServices(PointIconSelector)));
