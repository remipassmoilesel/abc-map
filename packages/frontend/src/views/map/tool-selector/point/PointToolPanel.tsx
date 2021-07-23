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
import { Logger } from '@abc-map/shared';
import ColorSelector from '../../../../components/color-picker/ColorSelector';
import PointSizeSelector from './size-selector/PointSizeSelector';
import PointIconSelector from './icon-selector/PointIconSelector';
import { ServiceProps, withServices } from '../../../../core/withServices';
import { MainState } from '../../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import Cls from './PointToolPanel.module.scss';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/user-documentation';
import ZIndex from '../_common/z-index/ZIndex';
import ApplyStyleButton from '../_common/ApplyStyleButton';

const logger = Logger.get('PointToolPanel.tsx');

const mapStateToProps = (state: MainState) => ({
  point: state.map.currentStyle.point,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class PointToolPanel extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.pointPanel}>
        <TipBubble id={ToolTips.Point} label={'Aide'} className={'mx-3 mb-4'} />
        <PointSizeSelector />
        <ColorSelector point={true} />
        <PointIconSelector />
        <ApplyStyleButton onClick={this.handleApplyStyle} />
        <ZIndex />
      </div>
    );
  }

  private handleApplyStyle = () => {
    const { geo, toasts } = this.props.services;
    const icon = this.props.point?.icon;
    const size = this.props.point?.size;
    const color = this.props.point?.color;
    if (!icon) {
      toasts.info('Vous devez sélectionner une icône');
      return;
    }
    if (!size) {
      toasts.info('Vous devez sélectionner une taille');
      return;
    }
    if (!color) {
      toasts.info('Vous devez sélectionner une couleur');
      return;
    }

    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        point: {
          ...style.point,
          icon,
          size,
          color,
        },
      };
    });
  };
}

export default withServices(connector(PointToolPanel));
