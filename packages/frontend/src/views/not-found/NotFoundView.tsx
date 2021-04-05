import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { Link } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/frontend-shared';
import Cls from './NotFoundView.module.scss';

const logger = Logger.get('NotFoundView.tsx');

class NotFoundView extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.notFoundView}>
        <h3>Cette page n&apos;existe pas !</h3>
        <Link to={FrontendRoutes.landing()}>Retourner à l&apos;accueil</Link>
      </div>
    );
  }
}

export default NotFoundView;
