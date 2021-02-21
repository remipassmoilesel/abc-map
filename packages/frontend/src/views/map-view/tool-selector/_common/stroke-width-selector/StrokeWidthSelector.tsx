import React, { ChangeEvent, Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { services } from '../../../../../core/Services';
import _ from 'lodash';
import Cls from './StrokeWidthSelector.module.scss';

const mapStateToProps = (state: MainState) => ({
  stroke: state.map.currentStyle.stroke,
});

const mapDispatchToProps = {
  setStrokeWidth: MapActions.setStrokeWidth,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class StrokeWidthSelector extends Component<Props, {}> {
  private services = services();

  public render(): ReactNode {
    return (
      <div className={'control-item d-flex align-items-center justify-content-between'}>
        <div className={'mr-2'}>Épaisseur:</div>
        <select value={this.props.stroke.width} onChange={this.handleSelection} className={`form-control form-control-sm ${Cls.select}`}>
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
    const width = Number(ev.target.value);
    this.props.setStrokeWidth(width);

    this.services.geo.updateSelectedFeatures((style) => {
      style.stroke.width = width;
      return style;
    });
  };
}

export default connector(StrokeWidthSelector);
