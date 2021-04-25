import React, { Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import ColorPicker from './ColorPicker';
import { ServiceProps, withServices } from '../../../../../core/withServices';

export interface LocalProps {
  /**
   * Display stroke color selection.
   */
  stroke?: boolean;
  /**
   * Display fill color selection.
   */
  fillColor1?: boolean;
  /**
   * Display texture color selection.
   */
  fillColor2?: boolean;
}

const mapStateToProps = (state: MainState) => ({
  fillProps: state.map.currentStyle.fill,
  strokeProps: state.map.currentStyle.stroke,
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
    const stroke = this.props.stroke;
    const fillColor1 = this.props.fillColor1;
    const fillColor2 = this.props.fillColor2;
    const strokeProps = this.props.strokeProps;
    const fillProps = this.props.fillProps;

    return (
      <div className={'control-item'}>
        {stroke && <ColorPicker label={'Trait'} initialValue={strokeProps?.color} onClose={this.handleStrokeColor} data-cy={'stroke-color'} />}
        {fillColor1 && <ColorPicker label={'Remplissage'} initialValue={fillProps?.color1} onClose={this.handleFillColor1} data-cy={'fill-color1'} />}
        {fillColor2 && <ColorPicker label={'Texture'} initialValue={fillProps?.color2} onClose={this.handleFillColor2} data-cy={'fill-color2'} />}
      </div>
    );
  }

  private handleStrokeColor = (color: string): void => {
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

  private handleFillColor1 = (color: string): void => {
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

  private handleFillColor2 = (color: string): void => {
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
