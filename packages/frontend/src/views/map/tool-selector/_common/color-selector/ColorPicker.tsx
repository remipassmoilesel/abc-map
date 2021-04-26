import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { ColorResult, SketchPicker } from 'react-color';
import { Modal } from 'react-bootstrap';
import Cls from './ColorPicker.module.scss';

const logger = Logger.get('ColorPickerButton.tsx', 'info');

interface Props {
  label: string;
  initialValue?: string;
  onClose: (value: string) => void;
  'data-cy'?: string;
}

interface State {
  modalVisible: boolean;
  value: string;
}

class ColorPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      value: this.props.initialValue || '#fffff',
    };
  }

  public render(): ReactNode {
    return (
      <>
        <div className={'control-item d-flex align-item-center justify-content-between my-2'} data-cy={this.props['data-cy']}>
          <div>{this.props.label}:</div>
          <button onClick={this.handleClick} className={Cls.button} type={'button'} style={{ backgroundColor: this.state.value }} />
        </div>
        <Modal show={this.state.modalVisible} onHide={this.handleModalClose} size={'sm'}>
          <Modal.Header closeButton>{this.props.label}</Modal.Header>
          <Modal.Body className={'d-flex justify-content-center'}>
            <SketchPicker color={this.state.value} onChange={this.handleChange} width={'300px'} />
          </Modal.Body>
          <Modal.Footer>
            <button className={'btn btn-outline-secondary'} onClick={this.handleModalClose} data-cy={'close-modal'}>
              Fermer
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  private handleChange = (color: ColorResult) => {
    this.setState({ value: color.hex });
  };

  private handleClick = () => {
    this.setState({ modalVisible: true });
  };

  private handleModalClose = () => {
    this.setState({ modalVisible: false });
    this.props.onClose(this.state.value);
  };
}

export default ColorPicker;
