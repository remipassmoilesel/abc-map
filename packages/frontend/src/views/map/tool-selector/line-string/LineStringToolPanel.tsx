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
import StrokeWidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import { ServiceProps, withServices } from '../../../../core/withServices';
import { MainState } from '../../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import Cls from './LineStringToolPanel.module.scss';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/user-documentation';
import ZIndex from '../_common/z-index/ZIndex';

const logger = Logger.get('LineStringToolPanel.tsx');

const mapStateToProps = (state: MainState) => ({
  stroke: state.map.currentStyle.stroke,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class LineStringToolPanel extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.lineStringPanel}>
        <TipBubble id={ToolTips.LineString} label={'Aide'} className={'mx-3 mb-4'} />
        <StrokeWidthSelector />
        <ColorSelector stroke={true} />
        <div className={'d-flex justify-content-center mb-3'}>
          <button className={'btn btn-sm btn-outline-primary mt-3'} onClick={this.handleApplyStyle}>
            Appliquer le style
          </button>
        </div>
        <ZIndex />
      </div>
    );
  }

  private handleApplyStyle = () => {
    const { geo, toasts } = this.props.services;
    const color = this.props.stroke?.color;
    const width = this.props.stroke?.width;
    if (!color) {
      toasts.info('Vous devez sélectionner une couleur');
      return;
    }
    if (!width) {
      toasts.info('Vous devez sélectionner une épaisseur');
      return;
    }

    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        stroke: {
          ...style.stroke,
          color,
          width,
        },
      };
    });
  };
}

export default withServices(connector(LineStringToolPanel));
