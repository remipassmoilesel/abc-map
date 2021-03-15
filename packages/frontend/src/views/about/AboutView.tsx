import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { ServiceProps, withServices } from '../../core/withServices';
import Cls from './AboutView.module.scss';

const logger = Logger.get('About.tsx', 'info');

declare type Props = ServiceProps;

class AboutView extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.about}>
        <h1>A propos d&apos;Abc-Map</h1>
        <p>Sur cette page vous en apprendrez plus sur ce projet, sur son développement et sur les outils utilisés pour créer ce logiciel.</p>
        <p>Cette page n&apos;est pas terminée !</p>
      </div>
    );
  }
}

export default withServices(AboutView);
