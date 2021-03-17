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
        <h2 data-cy={'punchline'} className={'text-uppercase text-center'}>
          Une entreprise vous vendrait ce logiciel 60 000€
        </h2>
        <h4 className={'text-center'}>(et à ce prix là il marcherait à peine)</h4>
      </div>
    );
  }
}

export default withServices(AboutView);
