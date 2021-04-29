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
  /**
   * Display point color selection.
   */
  point?: boolean;
}

const mapStateToProps = (state: MainState) => ({
  fillProps: state.map.currentStyle.fill,
  strokeProps: state.map.currentStyle.stroke,
  pointProps: state.map.currentStyle.point,
});

const mapDispatchToProps = {
  setFillColor1: MapActions.setFillColor1,
  setFillColor2: MapActions.setFillColor2,
  setStrokeColor: MapActions.setStrokeColor,
  setPointColor: MapActions.setPointColor,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & LocalProps & ServiceProps;

class ColorSelector extends Component<Props, {}> {
  public render(): ReactNode {
    const strokeColor = this.props.stroke;
    const fillColor1 = this.props.fillColor1;
    const fillColor2 = this.props.fillColor2;
    const pointColor = this.props.point;

    const strokeProps = this.props.strokeProps;
    const fillProps = this.props.fillProps;
    const pointProps = this.props.pointProps;

    return (
      <div className={'control-item'}>
        {strokeColor && <ColorPicker label={'Trait'} initialValue={strokeProps?.color} onClose={this.handleStrokeColor} data-cy={'stroke-color'} />}
        {fillColor1 && <ColorPicker label={'Remplissage'} initialValue={fillProps?.color1} onClose={this.handleFillColor1} data-cy={'fill-color1'} />}
        {fillColor2 && <ColorPicker label={'Texture'} initialValue={fillProps?.color2} onClose={this.handleFillColor2} data-cy={'fill-color2'} />}
        {pointColor && <ColorPicker label={"Couleur d'icône"} initialValue={pointProps?.color} onClose={this.handlePointColor} data-cy={'point-color'} />}
      </div>
    );
  }

  private handleStrokeColor = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setStrokeColor(color);
    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        stroke: {
          ...style.stroke,
          color,
        },
      };
    });
  };

  private handleFillColor1 = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setFillColor1(color);
    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        fill: {
          ...style.fill,
          color1: color,
        },
      };
    });
  };

  private handleFillColor2 = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setFillColor2(color);
    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        fill: {
          ...style.fill,
          color2: color,
        },
      };
    });
  };

  private handlePointColor = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setPointColor(color);
    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        point: {
          ...style.point,
          color,
        },
      };
    });
  };
}

export default connector(withServices(ColorSelector));
