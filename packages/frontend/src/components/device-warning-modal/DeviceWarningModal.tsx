import React, { Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import * as Bowser from 'bowser';
import { Logger } from '@abc-map/frontend-shared';
import './DeviceWarningModal.scss';

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
    if (!this.state.visible) {
      return <div />;
    }

    return (
      <Modal show={this.state.visible} onHide={this.handleClose} backdrop={'static'} className={'abc-device-warning'}>
        <Modal.Header closeButton>
          <Modal.Title>Avertissement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div data-cy={'device-warning'}>Abc-Map risque de ne pas fonctionner correctement !</div>
          <div className={'m-3'}>
            Abc-Map est conçu pour fonctionner sur un ordinateur de bureau, avec les navigateurs Chromium ou Firefox. La configuration détectée sur votre
            appareil peut entrainer des problèmes d&apos;utilisation.
          </div>
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
