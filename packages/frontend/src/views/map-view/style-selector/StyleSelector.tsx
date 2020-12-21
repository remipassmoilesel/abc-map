import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '../../../core/utils/Logger';
import { RootState } from '../../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { MapActions } from '../../../core/store/map/actions';
import ColorPickerButton from './ColorPickerButton';
import _ from 'lodash';
import { services } from '../../../core/Services';
import { StyleProperties } from '@abc-map/shared-entities';
import './StyleSelector.scss';

const logger = Logger.get('ColorPicker.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

const mapStateToProps = (state: RootState) => ({
  map: state.map.mainMap,
  fill: state.map.currentStyle.fill,
  stroke: state.map.currentStyle.stroke,
});

const mapDispatchToProps = {
  setFillColor: MapActions.setFillColor,
  setStrokeColor: MapActions.setStrokeColor,
  setStrokeWidth: MapActions.setStrokeWidth,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class StyleSelector extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const widthOptions = _.range(1, 25).map((value) => (
      <option key={value} value={value}>
        {value}
      </option>
    ));
    return (
      <div className={'control-block abc-style-selector'}>
        <div className={'control-item'}>
          <div>Couleurs:</div>
          <ColorPickerButton label={'Premier plan'} initialValue={this.props.stroke.color} onChange={this.onStrokeColorSelected} />
          <ColorPickerButton label={'Arrière plan'} initialValue={this.props.fill.color} onChange={this.onFillColorSelected} />
        </div>
        <div className={'control-item'}>
          <div>Trait:</div>
          <select value={this.props.stroke.width} onChange={this.onWidthSelected} className={'form-control'}>
            {widthOptions}
          </select>
        </div>
      </div>
    );
  }

  private onFillColorSelected = (color: string): void => {
    this.props.setFillColor(color);
    if (this.props.map) {
      this.services.map.forEachFeatureSelected(this.props.map, (feat) => {
        feat.set(StyleProperties.FillColor, color);
      });
    }
  };

  private onStrokeColorSelected = (color: string): void => {
    this.props.setStrokeColor(color);
    if (this.props.map) {
      this.services.map.forEachFeatureSelected(this.props.map, (feat) => {
        feat.set(StyleProperties.StrokeColor, color);
      });
    }
  };

  private onWidthSelected = (ev: ChangeEvent<HTMLSelectElement>): void => {
    const width = Number(ev.target.value);
    this.props.setStrokeWidth(width);
    if (this.props.map) {
      this.services.map.forEachFeatureSelected(this.props.map, (feat) => {
        feat.set(StyleProperties.StrokeWidth, width);
      });
    }
  };
}

export default connector(StyleSelector);
