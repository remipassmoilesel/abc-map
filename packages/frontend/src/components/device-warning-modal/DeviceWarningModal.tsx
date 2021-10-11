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
import * as Bowser from 'bowser';
import { Logger } from '@abc-map/shared';
import phoneWarning from './phone-warning.png';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './DeviceWarningModal.module.scss';

const logger = Logger.get('DeviceWarningModal.tsx');

interface State {
  visible: boolean;
}

const t = prefixedTranslation('DeviceWarningModal:');

class DeviceWarningModal extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { visible: false };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.handleClose} backdrop={'static'} dialogClassName={Cls.deviceWarning}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Warning')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'d-flex align-items-center'}>
            <img src={phoneWarning} width={'200'} className={'m-3'} alt={'Ordinateur de bureau conseillé'} />
            <div className={'m-3'}>
              <div data-cy={'device-warning'}>{t('AbcMap_may_not_work_properly')} 🤔</div>
              <div className={'my-3'} dangerouslySetInnerHTML={{ __html: t('AbcMap_is_designed_for_desktop_computers') }} />
            </div>
          </div>
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-primary'} onClick={this.handleClose} data-cy="device-warning-confirm">
              {t('I_understand')}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    if (!this.isOptimalDevice()) {
      this.setState({ visible: true });
    }
  }

  public handleClose = () => {
    this.setState({ visible: false });
  };

  public isOptimalDevice(): boolean {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const deviceSupported = browser.getPlatform().type === 'desktop';
    const browserSupported = ['chrome', 'electron', 'firefox'].indexOf(browser.getBrowserName(true)) !== -1;
    const screenSizeSupported = window.innerWidth >= 1366 && window.innerHeight >= 768;
    return deviceSupported && browserSupported && screenSizeSupported;
  }
}

export default withTranslation()(DeviceWarningModal);
