import React, { Component, ReactNode } from 'react';
import { Logger } from '../../core/utils/Logger';
import { FrontendRoutes } from '../../FrontendRoutes';
import { Link } from 'react-router-dom';
import './TopBar.scss';

const logger = Logger.get('TopBar.tsx', 'info');

class TopBar extends Component<{}, {}> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'abc-top-bar'}>
        <h1>
          <Link to={FrontendRoutes.Landing}>
            <i className={'fa fa-map-marked-alt mr-2'} />
            Abc-Map
          </Link>
        </h1>
        <Link to={FrontendRoutes.Map} className={'link'}>
          Carte
        </Link>
        <Link to={FrontendRoutes.DataStore} className={'link'}>
          Catalogue de données
        </Link>
        <Link to={FrontendRoutes.Layout} className={'link'}>
          Mise en page
        </Link>
        <Link to={FrontendRoutes.Settings} className={'link'}>
          Paramètres
        </Link>
        <Link to={FrontendRoutes.Help} className={'link'}>
          Aide
        </Link>
        <Link to={FrontendRoutes.About} className={'link'}>
          A propos
        </Link>
      </div>
    );
  }
}

export default TopBar;
