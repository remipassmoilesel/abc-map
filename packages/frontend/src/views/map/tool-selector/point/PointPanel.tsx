import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import ColorSelector from '../_common/color-selector/ColorSelector';
import PointSizeSelector from './size-selector/PointSizeSelector';
import PointIconSelector from './icon-selector/PointIconSelector';
import { ServiceProps, withServices } from '../../../../core/withServices';
import { MainState } from '../../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import Cls from './PointPanel.module.scss';

const logger = Logger.get('PointPanel.tsx');

const mapStateToProps = (state: MainState) => ({
  point: state.map.currentStyle.point,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class PointPanel extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.pointPanel}>
        <PointSizeSelector />
        <ColorSelector point={true} />
        <PointIconSelector />
        <div className={'d-flex justify-content-center'}>
          <button className={'btn btn-sm btn-outline-primary mt-3'} onClick={this.handleApplyStyle}>
            Appliquer le style
          </button>
        </div>
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

export default withServices(connector(PointPanel));
