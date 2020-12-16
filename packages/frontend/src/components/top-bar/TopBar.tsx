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
        <h3 className={'text-center mt-2'}>Abc-Map</h3>
        <Link to={FrontendRoutes.Landing} className={'link'}>
          Accueil
        </Link>
        <Link to={FrontendRoutes.Map} className={'link'}>
          Carte
        </Link>
        <Link to={FrontendRoutes.DataStore} className={'link'}>
          Magasin de données
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
      </div>
    );
  }
}

export default TopBar;
