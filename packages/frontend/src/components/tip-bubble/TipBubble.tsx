import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { Modal } from 'react-bootstrap';
import { AllTips } from '@abc-map/documentation';
import Cls from './TipBubble.module.scss';

const logger = Logger.get('TipBubble.tsx', 'info');

interface Props {
  id: string;
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
    const modal = this.state.open;

    return (
      <>
        <div onClick={this.handleClick} className={Cls.bubble}>
          <i className={`fa fa-question`} />
        </div>
        <Modal show={modal} onHide={this.handleHide}>
          <Modal.Body>
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
