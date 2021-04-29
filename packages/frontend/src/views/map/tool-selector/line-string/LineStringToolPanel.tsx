import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import ColorSelector from '../_common/color-selector/ColorSelector';
import StrokeWidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import { ServiceProps, withServices } from '../../../../core/withServices';
import { MainState } from '../../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import Cls from './LineStringToolPanel.module.scss';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/documentation';

const logger = Logger.get('LineStringToolPanel.tsx');

const mapStateToProps = (state: MainState) => ({
  stroke: state.map.currentStyle.stroke,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class LineStringToolPanel extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.linePanel}>
        <TipBubble id={ToolTips.LineString} label={'Aide'} className={'mx-3 mb-4'} />
        <StrokeWidthSelector />
        <ColorSelector stroke={true} />
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
