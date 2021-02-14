import React, { Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { services } from '../../../../../core/Services';
import ColorPickerButton from './ColorPickerButton';
import { UpdateStyleItem, UpdateStyleTask } from '../../../../../core/history/tasks/UpdateStyleTask';
import { VectorStyles } from '../../../../../core/geo/style/VectorStyles';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AbcStyleProperties } from '../../../../../core/geo/style/AbcStyleProperties';

export interface LocalProps {
  withFillColors: boolean;
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

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class ColorSelector extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const withFill = this.props.withFillColors;
    return (
      <div className={'control-item mb-3'}>
        <div className={'mb-1'}>Couleurs:</div>
        <ColorPickerButton label={'Trait'} initialValue={this.props.stroke.color} onChange={this.handleStrokeColorSelected} data-cy={'stroke-color'} />
        {withFill && (
          <>
            <ColorPickerButton label={'Remplissage'} initialValue={this.props.fill.color1} onChange={this.handleFillColor1Selected} data-cy={'fill-color1'} />
            <ColorPickerButton label={'Texture'} initialValue={this.props.fill.color2} onChange={this.handleFillColor2Selected} data-cy={'fill-color2'} />
          </>
        )}
      </div>
    );
  }

  private handleStrokeColorSelected = (color: string): void => {
    this.props.setStrokeColor(color);
    this.updateFeatures((style) => {
      style.stroke.color = color;
      return style;
    });
  };

  private handleFillColor1Selected = (color: string): void => {
    this.props.setFillColor1(color);
    this.updateFeatures((style) => {
      style.fill.color1 = color;
      return style;
    });
  };

  private handleFillColor2Selected = (color: string): void => {
    this.props.setFillColor2(color);
    this.updateFeatures((style) => {
      style.fill.color2 = color;
      return style;
    });
  };

  private updateFeatures(transform: (x: AbcStyleProperties) => AbcStyleProperties) {
    const historyItems: UpdateStyleItem[] = [];
    this.services.geo.getMainMap().forEachFeatureSelected((feat) => {
      const newStyle = transform(VectorStyles.getProperties(feat));

      historyItems.push({
        feature: feat,
        before: VectorStyles.getProperties(feat),
        after: newStyle,
      });

      VectorStyles.setProperties(feat, newStyle);
    });

    if (historyItems.length) {
      this.services.history.register(HistoryKey.Map, new UpdateStyleTask(historyItems));
    }
  }
}

export default connector(ColorSelector);
