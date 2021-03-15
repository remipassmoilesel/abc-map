import React, { Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import ColorPicker from './ColorPicker';
import { ServiceProps, withServices } from '../../../../../core/withServices';

export interface LocalProps {
  fillColors: boolean;
}

const mapStateToProps = (state: MainState) => ({
  fill: state.map.currentStyle.fill,
  stroke: state.map.currentStyle.stroke,
});

const mapDispatchToProps = {
  setFillColor1: MapActions.setFillColor1,
  setFillColor2: MapActions.setFillColor2,
  setStrokeColor: MapActions.setStrokeColor,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & LocalProps & ServiceProps;

class ColorSelector extends Component<Props, {}> {
  public render(): ReactNode {
    const withFill = this.props.fillColors;
    const stroke = this.props.stroke;
    const fill = this.props.fill;
    return (
      <div className={'control-item'}>
        <ColorPicker label={'Trait'} initialValue={stroke?.color} onClose={this.handleStrokeColorSelected} data-cy={'stroke-color'} />
        {withFill && (
          <>
            <ColorPicker label={'Remplissage'} initialValue={fill?.color1} onClose={this.handleFillColor1Selected} data-cy={'fill-color1'} />
            <ColorPicker label={'Texture'} initialValue={fill?.color2} onClose={this.handleFillColor2Selected} data-cy={'fill-color2'} />
          </>
        )}
      </div>
    );
  }

  private handleStrokeColorSelected = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setStrokeColor(color);
    geo.updateSelectedFeatures((style) => {
      style.stroke = {
        ...style.stroke,
        color,
      };
      return style;
    });
  };

  private handleFillColor1Selected = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setFillColor1(color);
    geo.updateSelectedFeatures((style) => {
      style.fill = {
        ...style.fill,
        color1: color,
      };
      return style;
    });
  };

  private handleFillColor2Selected = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setFillColor2(color);
    geo.updateSelectedFeatures((style) => {
      style.fill = {
        ...style.fill,
        color2: color,
      };
      return style;
    });
  };
}

export default connector(withServices(ColorSelector));
