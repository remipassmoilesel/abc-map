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
import Cls from './DeviceWarningModal.module.scss';

const logger = Logger.get('DeviceWarningModal.tsx');

interface State {
  visible: boolean;
}

class DeviceWarningModal extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.handleClose} backdrop={'static'} className={Cls.deviceWarning}>
        <Modal.Header closeButton>
          <Modal.Title>Avertissement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div data-cy={'device-warning'}>Abc-Map risque de ne pas fonctionner correctement 🤔</div>
          <div className={'my-3'}>Abc-Map est conçu pour fonctionner sur un ordinateur de bureau, avec les navigateurs Chromium ou Firefox.</div>
          <div className={'my-3'}>Votre configuration actuelle peut entrainer des problèmes d&apos;affichage et d&apos;utilisation.</div>
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-primary'} onClick={this.handleClose} data-cy="device-warning-confirm">
              J&apos;ai compris
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    if (!this.isOptimalSetup()) {
      this.setState({ visible: true });
    }
  }

  public handleClose = () => {
    this.setState({ visible: false });
  };

  public isOptimalSetup(): boolean {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const deviceSupported = browser.getPlatform().type === 'desktop';
    const browserSupported = ['chrome', 'firefox', 'electron'].indexOf(browser.getBrowserName(true)) !== -1;
    const screenSizeSupported = window.innerWidth > 1000 && window.innerHeight > 600;
    return deviceSupported && browserSupported && screenSizeSupported;
  }
}

export default DeviceWarningModal;
