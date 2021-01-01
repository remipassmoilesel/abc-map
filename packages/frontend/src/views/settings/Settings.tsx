import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '../../core/utils/Logger';
import './Settings.scss';

const logger = Logger.get('Landing.tsx', 'info');

class Settings extends Component<{}, {}> {
  private services = services();

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'abc-settings'}>
        <h1>Paramètres</h1>
        <p>Sur cette page vous pouvez configurer Abc-Map.</p>
        <p>Cette page n&apos;est pas terminée !</p>
      </div>
    );
  }
}

export default Settings;
