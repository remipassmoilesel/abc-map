import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { FillPatterns } from '@abc-map/shared-entities';
import { LabelledFillPatterns } from './LabelledFillPatterns';
import { FillPatternFactory } from '../../../../../core/geo/style/FillPatternFactory';
import { MainState } from '../../../../../core/store/reducer';
import { MapActions } from '../../../../../core/store/map/actions';
import { connect, ConnectedProps } from 'react-redux';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import { Modal } from 'react-bootstrap';
import FillPatternButton from './FillPatternButton';
import Cls from './FillPatternSelector.module.scss';

const logger = Logger.get('FillPatternSelector.tsx', 'info');

const mapStateToProps = (state: MainState) => ({
  fill: state.map.currentStyle.fill,
});

const mapDispatchToProps = {
  setPattern: MapActions.setFillPattern,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

interface State {
  patternFactory: FillPatternFactory;
  modal: boolean;
}

class FillPatternSelector extends Component<Props, State> {
  private canvas = React.createRef<HTMLCanvasElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      patternFactory: new FillPatternFactory(),
      modal: false,
    };
  }

  public render(): ReactNode {
    const pattern = this.props.fill?.pattern;
    const color1 = this.props.fill?.color1;
    const color2 = this.props.fill?.color2;
    const modal = this.state.modal;

    return (
      <>
        <div className={`${Cls.fillPatternSelector} control-item`}>
          <div>Style de texture:</div>
          <FillPatternButton width={40} height={40} pattern={pattern} color1={color1} color2={color2} onClick={this.showModal} />
        </div>
        <Modal show={modal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Textures</Modal.Title>
          </Modal.Header>
          <Modal.Body className={'p-2'}>{this.getPatternButtons()}</Modal.Body>
        </Modal>
      </>
    );
  }

  private showModal = () => {
    this.setState({ modal: true });
  };

  private closeModal = () => {
    this.setState({ modal: false });
  };

  private getPatternButtons(): ReactNode[] {
    const color1 = this.props.fill?.color1;
    const color2 = this.props.fill?.color2;
    return LabelledFillPatterns.All.map((item) => {
      return (
        <div className={'d-flex align-items-center m-3'} key={item.value}>
          <FillPatternButton onClick={this.handleSelection} pattern={item.value} color1={color1} color2={color2} width={65} height={65} />
          <div className={'ml-3'}>{item.label}</div>
        </div>
      );
    });
  }

  private handleSelection = (pattern: FillPatterns) => {
    const { geo } = this.props.services;

    this.props.setPattern(pattern);
    this.setState({ modal: false });

    geo.updateSelectedFeatures((style) => {
      return {
        ...style,
        fill: {
          ...style.fill,
          pattern,
        },
      };
    });
  };
}

export default connector(withServices(FillPatternSelector));
