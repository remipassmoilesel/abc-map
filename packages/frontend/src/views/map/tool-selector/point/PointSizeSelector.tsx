import React, { ChangeEvent, Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../core/store/reducer';
import { MapActions } from '../../../../core/store/map/actions';
import * as _ from 'lodash';
import { ServiceProps, withServices } from '../../../../core/withServices';
import Cls from './PointSizeSelector.module.scss';

const mapStateToProps = (state: MainState) => ({
  point: state.map.currentStyle.point,
});

const mapDispatchToProps = {
  setPointSize: MapActions.setPointSize,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class StrokeWidthSelector extends Component<Props, {}> {
  public render(): ReactNode {
    const size = this.props.point?.size;

    return (
      <div className={'control-item d-flex align-items-center justify-content-between'}>
        <div className={'mr-2'}>Taille:</div>
        <select value={size} onChange={this.handleSelection} className={`form-control form-control-sm ${Cls.select}`}>
          {_.range(15, 101).map((value) => (
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

    const size = Number(ev.target.value);
    this.props.setPointSize(size);

    geo.updateSelectedFeatures((style) => {
      style.point = {
        ...style.point,
        size,
      };
      return style;
    });
  };
}

export default connector(withServices(StrokeWidthSelector));
