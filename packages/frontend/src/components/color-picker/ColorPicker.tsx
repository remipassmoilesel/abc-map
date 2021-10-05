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
import { ColorResult, RGBColor, SketchPicker } from 'react-color';
import { Modal } from 'react-bootstrap';
import Cls from './ColorPicker.module.scss';
import { ColorTranslator } from 'colortranslator';

const { toRGBA } = ColorTranslator;

interface Props {
  initialValue?: string;
  onClose: (value: string) => void;
  'data-cy'?: string;
}

interface State {
  modalVisible: boolean;
  value: RGBColor;
}
const i18n = {
  title: {
    fr: 'Sélectionnez une couleur',
    en: 'Select a color',
  },
};

class ColorPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      value: this.props.initialValue ? toRGBA(this.props.initialValue, false) : { r: 220, g: 220, b: 254, a: 0.9 },
    };
  }

  public render(): ReactNode {
    const value = this.state.value;
    const modalVisible = this.state.modalVisible;

    return (
      <>
        {/* Button, always visible */}
        <button onClick={this.handleClick} className={Cls.button} type={'button'} style={{ backgroundColor: toRGBA(value) }} data-cy={this.props['data-cy']} />

        {/* Modal, visible on demand */}
        <Modal show={modalVisible} onHide={this.handleModalClose} size={'sm'}>
          <Modal.Header closeButton>{i18n.title.fr}</Modal.Header>
          <Modal.Body className={'d-flex justify-content-center'}>
            <SketchPicker disableAlpha={false} color={value} onChange={this.handleChange} width={'300px'} />
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.handleModalClose} data-cy={'close-modal'} className={'btn btn-outline-secondary'}>
              Fermer
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  private handleChange = (color: ColorResult) => {
    this.setState({ value: color.rgb });
  };

  private handleClick = () => {
    this.setState({ modalVisible: true });
  };

  private handleModalClose = () => {
    this.setState({ modalVisible: false });
    this.props.onClose(toRGBA(this.state.value));
  };
}

export default ColorPicker;
