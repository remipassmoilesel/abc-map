import React, { ChangeEvent, Component, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../../core/store/reducer';
import { MapActions } from '../../../../core/store/map/actions';
import { services } from '../../../../core/Services';
import _ from 'lodash';

const mapStateToProps = (state: MainState) => ({
  fill: state.map.currentStyle.fill,
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
      <div className={'control-item'}>
        <div>Trait:</div>
        <select value={this.props.stroke.width} onChange={this.handleWidthSelected} className={'form-control'}>
          {widthOptions}
        </select>
      </div>
    );
  }

  private handleWidthSelected = (ev: ChangeEvent<HTMLSelectElement>): void => {
    const width = Number(ev.target.value);
    this.props.setStrokeWidth(width);

    this.services.geo.updateSelectedFeatures((style) => {
      style.stroke.width = width;
      return style;
    });
  };
}

export default connector(StrokeWidthSelector);