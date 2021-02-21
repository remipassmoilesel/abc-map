import React, { Component, ReactNode } from 'react';
import { Logger } from '../../core/utils/Logger';
import './Settings.scss';

const logger = Logger.get('Landing.tsx');

class Settings extends Component<{}, {}> {
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
