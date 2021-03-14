import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '@abc-map/frontend-shared';
import './AboutView.scss';

const logger = Logger.get('Help.tsx', 'info');

class AboutView extends Component<{}, {}> {
  private services = services();

  public render(): ReactNode {
    return (
      <div className={'abc-about'}>
        <h1>A propos d&apos;Abc-Map</h1>
        <p>Sur cette page vous en apprendrez plus sur ce projet, sur son développement et sur les outils utilisés pour créer ce logiciel.</p>
        <p>Cette page n&apos;est pas terminée !</p>
      </div>
    );
  }
}

export default AboutView;
