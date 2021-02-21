import React, { ChangeEvent, Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { services } from '../../../../../core/Services';
import ColorPicker from '../color-selector/ColorPicker';
import * as _ from 'lodash';

const mapStateToProps = (state: MainState) => ({
  color: state.map.currentStyle.text.color,
  size: state.map.currentStyle.text.size,
});

const mapDispatchToProps = {
  setColor: MapActions.setTextColor,
  setSize: MapActions.setTextSize,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class TextFormat extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'control-item mb-3'}>
        <div className={'mb-1'}>Texte:</div>
        <ColorPicker label={'Texte'} initialValue={this.props.color} onChange={this.handleColorSelected} />
        <select onChange={this.handleSizeChange} value={this.props.size}>
          {_.chain(_.range(5, 50))
            .map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))
            .value()}
        </select>
      </div>
    );
  }

  private handleColorSelected = (color: string): void => {
    this.props.setColor(color);
    this.services.geo.updateSelectedFeatures((style) => {
      style.text.color = color;
      return style;
    });
  };

  private handleSizeChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
    const size = parseInt(ev.target.value);
    this.props.setSize(size);
    this.services.geo.updateSelectedFeatures((style) => {
      style.text.size = size;
      return style;
    });
  };
}

export default connector(TextFormat);
