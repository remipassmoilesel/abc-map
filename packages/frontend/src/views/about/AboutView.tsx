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
          A propos
        </h2>
      </div>
    );
  }
}

export default withServices(AboutView);
