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
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './LegendSymbolPickerModal.module.scss';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';

interface State {
  visible: boolean;
  styles: StyleCacheEntry[];
}

const t = prefixedTranslation('LegendSymbolPickerModal:');

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
      <Modal show={visible} onHide={this.handleCancel} size={'xl'} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaIcon icon={IconDefs.faMapMarkerAlt} className={'mr-3'} />
            {t('Select_symbol')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'mb-4'}>{t('Here_are_the_geometry_styles_used_on_the_map')}:</div>
          <div className={Cls.symbolContainer}>
            {styles.map((st) => (
              <LegendSymbolButton key={st.id} style={st} onClick={this.handleSymbolSelected} />
            ))}
            {!styles.length && (
              <div className={Cls.noSymbol}>
                <FaIcon icon={IconDefs.faExclamation} className={Cls.bigIcon} />
                {t('Add_something_on_map_then_come_back')}
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

export default withTranslation()(withServices(LegendSymbolPickerModal));
