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
          <Link to={FrontendRoutes.landing()}>
            <i className={'fa fa-map-marked-alt mr-2'} />
            Abc-Map
          </Link>
        </h1>
        <Link to={FrontendRoutes.map()} className={'link'}>
          Carte
        </Link>
        <Link to={FrontendRoutes.dataStore()} className={'link'}>
          Catalogue de données
        </Link>
        <Link to={FrontendRoutes.layout()} className={'link'}>
          Mise en page
        </Link>
        <Link to={FrontendRoutes.settings()} className={'link'}>
          Paramètres
        </Link>
        <Link to={FrontendRoutes.help()} className={'link'}>
          Aide
        </Link>
        <Link to={FrontendRoutes.about()} className={'link'}>
          A propos
        </Link>
      </div>
    );
  }
}

export default TopBar;
