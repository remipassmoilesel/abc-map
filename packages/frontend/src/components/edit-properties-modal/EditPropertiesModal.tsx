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
import { ModalEventType, ModalStatus, ShowFeaturePropertiesModal } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { SimplePropertiesMap } from '../../core/geo/features/FeatureWrapper';
import PropertiesForm from './PropertiesForm';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';

interface State {
  visible: boolean;
  properties?: SimplePropertiesMap;
  newProperties?: SimplePropertiesMap;
}

const t = prefixedTranslation('EditPropertiesModal:');

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
      <Modal show={visible} onHide={this.handleCancel} size={'lg'} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Properties')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={'d-flex flex-column'}>
          {/* Properties edition */}
          <PropertiesForm properties={properties} onChange={this.handlePropertiesChange} onNewPropertiesChange={this.handleNewPropertiesChange} />

          {/* Confirm and cancel buttons */}
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel} data-cy="properties-modal-cancel">
              {t('Cancel')}
            </button>
            <button className={'btn btn-primary'} onClick={this.handleConfirm} data-cy="properties-modal-confirm">
              {t('Save')}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    modals.addListener(ModalEventType.ShowFeatureProperties, this.handleOpen);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    modals.removeListener(ModalEventType.ShowFeatureProperties, this.handleOpen);
  }

  private handleOpen = (ev: ShowFeaturePropertiesModal) => {
    this.setState({ visible: true, properties: ev.properties });
  };

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
    const result = {
      ...this.state.properties,
      ...this.state.newProperties,
    };

    for (const k in result) {
      result[k] = this.normalizeProperty(result[k]);
    }

    return result;
  }

  private normalizeProperty(property: string | number | undefined): string | number | undefined {
    if (typeof property === 'string') {
      return property.trim();
    }
    return property;
  }
}

export default withTranslation()(withServices(EditPropertiesModal));
