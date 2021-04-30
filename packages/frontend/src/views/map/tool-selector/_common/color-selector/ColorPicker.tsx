/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

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
