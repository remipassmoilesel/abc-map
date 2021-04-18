import React, { Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { ModalEventListener, ModalEventType, ModalStatus } from '../../core/ui/Modals.types';
import { ServiceProps, withServices } from '../../core/withServices';
import { SimplePropertiesMap } from '../../core/geo/features/FeatureWrapper';
import PropertiesForm from './PropertiesForm';
import Cls from './EditPropertiesModal.module.scss';

interface State {
  visible: boolean;
  properties?: SimplePropertiesMap;
  newProperties?: SimplePropertiesMap;
  listener?: ModalEventListener;
}

class EditPropertiesModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = { visible: false };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const properties = this.state.properties;
    if (!visible || !properties) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.handleCancel} size={'lg'} className={Cls.modal}>
        <Modal.Header closeButton>
          <Modal.Title>Propriétés</Modal.Title>
        </Modal.Header>
        <Modal.Body className={'d-flex flex-column'}>
          {/* Properties edition */}
          <PropertiesForm properties={properties} onChange={this.handlePropertiesChange} onNewPropertiesChange={this.handleNewPropertiesChange} />

          {/* Confirm and cancel buttons */}
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel} data-cy="properties-modal-cancel">
              Annuler
            </button>
            <button className={'btn btn-primary'} onClick={this.handleConfirm} data-cy="properties-modal-confirm">
              Confirmer
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    const listener: ModalEventListener = (ev) => {
      if (ev.type === ModalEventType.ShowFeatureProperties) {
        this.setState({ visible: true, properties: ev.properties });
      }
    };
    modals.addListener(ModalEventType.ShowFeatureProperties, listener);

    this.setState({ listener });
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;
    const listener = this.state.listener;

    if (listener) {
      modals.removeListener(ModalEventType.ShowFeatureProperties, listener);
    }
  }

  private handlePropertiesChange = (properties: SimplePropertiesMap) => {
    this.setState({ properties });
  };

  private handleNewPropertiesChange = (properties: SimplePropertiesMap) => {
    this.setState({ newProperties: properties });
  };

  private handleCancel = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.FeaturePropertiesClosed,
      status: ModalStatus.Canceled,
      properties: this.getProperties(),
    });

    this.setState({ visible: false });
  };

  private handleConfirm = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.FeaturePropertiesClosed,
      status: ModalStatus.Confirmed,
      properties: this.getProperties(),
    });

    this.setState({ visible: false });
  };

  private getProperties(): SimplePropertiesMap {
    return {
      ...this.state.properties,
      ...this.state.newProperties,
    };
  }
}

export default withServices(EditPropertiesModal);
