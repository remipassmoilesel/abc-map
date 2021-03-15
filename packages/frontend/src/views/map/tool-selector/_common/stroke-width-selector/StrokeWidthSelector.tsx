import React, { ChangeEvent, Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import _ from 'lodash';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import Cls from './StrokeWidthSelector.module.scss';

const mapStateToProps = (state: MainState) => ({
  stroke: state.map.currentStyle.stroke,
});

const mapDispatchToProps = {
  setStrokeWidth: MapActions.setStrokeWidth,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class StrokeWidthSelector extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={'control-item d-flex align-items-center justify-content-between'}>
        <div className={'mr-2'}>Épaisseur:</div>
        <select value={this.props.stroke?.width} onChange={this.handleSelection} className={`form-control form-control-sm ${Cls.select}`}>
          {_.range(1, 50).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  }

  private handleSelection = (ev: ChangeEvent<HTMLSelectElement>): void => {
    const { geo } = this.props.services;

    const width = Number(ev.target.value);
    this.props.setStrokeWidth(width);

    geo.updateSelectedFeatures((style) => {
      style.stroke = {
        ...style.stroke,
        width,
      };
      return style;
    });
  };
}

export default connector(withServices(StrokeWidthSelector));
