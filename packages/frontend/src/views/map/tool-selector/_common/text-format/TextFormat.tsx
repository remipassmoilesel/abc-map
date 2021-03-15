import React, { ChangeEvent, Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import ColorPicker from '../color-selector/ColorPicker';
import * as _ from 'lodash';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import Cls from './TextFormat.module.scss';

const mapStateToProps = (state: MainState) => ({
  color: state.map.currentStyle.text?.color,
  size: state.map.currentStyle.text?.size,
});

const mapDispatchToProps = {
  setColor: MapActions.setTextColor,
  setSize: MapActions.setTextSize,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class TextFormat extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={'control-item'}>
        <ColorPicker label={'Texte'} initialValue={this.props.color} onClose={this.handleColorSelected} />
        <div className={'d-flex justify-content-between align-items-center'}>
          <div>Taille:</div>
          <select onChange={this.handleSizeChange} value={this.props.size} className={`form-control form-control-sm ${Cls.select}`}>
            {_.range(5, 51).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  private handleColorSelected = (color: string): void => {
    const { geo } = this.props.services;

    this.props.setColor(color);
    geo.updateSelectedFeatures((style) => {
      style.text = {
        ...style.text,
        color,
      };
      return style;
    });
  };

  private handleSizeChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
    const { geo } = this.props.services;

    const size = parseInt(ev.target.value);
    this.props.setSize(size);
    geo.updateSelectedFeatures((style) => {
      style.text = {
        ...style.text,
        size,
      };
      return style;
    });
  };
}

export default connector(withServices(TextFormat));
