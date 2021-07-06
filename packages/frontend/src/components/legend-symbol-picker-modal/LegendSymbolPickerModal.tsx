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
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { StyleFactory } from '../../core/geo/styles/StyleFactory';
import { StyleCacheEntry } from '../../core/geo/styles/StyleCache';
import LegendSymbolButton from './LegendSymbolButton';
import Cls from './LegendSymbolPickerModal.module.scss';

interface State {
  visible: boolean;
  styles: StyleCacheEntry[];
}

class LegendSymbolPickerModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = { visible: false, styles: [] };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const styles = this.state.styles;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.handleCancel} dialogClassName={Cls.modal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={'fa fa-map-marker-alt mr-3'} />
            Sélectionnez un symbole
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Voici les formes utilisées sur la carte:</div>
          <div className={Cls.symbolContainer}>
            {styles.map((st) => (
              <LegendSymbolButton key={st.id} style={st} onClick={this.handleSymbolSelected} />
            ))}
            {!styles.length && (
              <div className={Cls.noSymbol}>
                <i className={'fa fa-exclamation'} />
                Ajoutez quelque chose sur la carte et revenez ensuite
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;
    modals.addListener(ModalEventType.ShowLegendSymbolPicker, this.handleOpen);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;
    modals.removeListener(ModalEventType.ShowLegendSymbolPicker, this.handleOpen);
  }

  private handleOpen = () => {
    this.setState({ visible: true });

    const styles = StyleFactory.get().getAvailableStyles(1);
    this.setState({ styles: styles });
  };

  private handleCancel = () => {
    const { modals } = this.props.services;
    modals.dispatch({ type: ModalEventType.LegendSymbolPickerClosed, status: ModalStatus.Canceled });
    this.setState({ visible: false });
  };

  private handleSymbolSelected = (style: StyleCacheEntry) => {
    const { modals } = this.props.services;
    modals.dispatch({ type: ModalEventType.LegendSymbolPickerClosed, status: ModalStatus.Confirmed, style });
    this.setState({ visible: false });
  };
}

export default withServices(LegendSymbolPickerModal);
