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
import { Modal } from 'react-bootstrap';
import { AllTips } from '@abc-map/user-documentation';
import Cls from './TipBubble.module.scss';

interface Props {
  id: string;
  label?: string;
  className?: string;
}

interface State {
  open: boolean;
}

class TipBubble extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  public render(): ReactNode {
    const label = this.props.label;
    const className = this.props.className || '';
    const modal = this.state.open;

    return (
      <>
        <div onClick={this.handleClick} className={`${Cls.bubble} ${className}`}>
          {label && <div className={'mr-2'}>{label}</div>}
          <i className={`fa fa-question-circle`} />
        </div>
        <Modal show={modal} onHide={this.handleHide} dialogClassName={Cls.modal}>
          <Modal.Body className={Cls.modalContent}>
            <div dangerouslySetInnerHTML={{ __html: this.getTip() }} />
          </Modal.Body>
        </Modal>
      </>
    );
  }

  private handleClick = () => {
    this.setState({ open: true });
  };

  private handleHide = () => {
    this.setState({ open: false });
  };

  private getTip(): string {
    const id = this.props.id;
    const tip = AllTips.find((t) => t.id === id);
    return tip?.content || "Ce conseil n'est pas disponible.";
  }
}

export default TipBubble;
