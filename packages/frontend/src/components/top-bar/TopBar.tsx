/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { UserStatus } from '@abc-map/shared-entities';
import { FrontendRoutes } from '@abc-map/frontend-commons';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { MainState } from '../../core/store/reducer';
import { ServiceProps, withServices } from '../../core/withServices';
import TopBarLink from './TopBarLink';
import MainIcon from '../../assets/main-icon.svg';
import Cls from './TopBar.module.scss';

const logger = Logger.get('TopBar.tsx', 'info');

const mapStateToProps = (state: MainState) => ({
  userStatus: state.authentication.userStatus,
  user: state.authentication.user,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<any> & ServiceProps;

class TopBar extends Component<Props, {}> {
  public render(): ReactNode {
    const userAuthenticated = this.props.userStatus === UserStatus.Authenticated;
    const user = this.props.user;
    const userLabel = user && userAuthenticated ? user.email : 'Bonjour visiteur !';

    return (
      <div className={Cls.topBar} data-cy={'top-bar'}>
        <h1>
          <Link to={FrontendRoutes.landing()} data-cy={'landing'} className={'d-flex align-items-ce'}>
            <img src={MainIcon} alt={'Logo'} height={'25'} className={'mr-3'} />
            Abc-Map
          </Link>
        </h1>

        <div className={'flex-grow-1'} />

        <TopBarLink label={'Accueil'} to={FrontendRoutes.landing()} activeMatch={/^\/$/} data-cy={'landing'} />
        <TopBarLink label={'Carte'} to={FrontendRoutes.map()} data-cy={'map'} />
        <TopBarLink label={'Catalogue de données'} to={FrontendRoutes.dataStore()} data-cy={'data-store'} />
        <TopBarLink label={'Traitement de données'} to={FrontendRoutes.dataProcessing('')} data-cy={'data-processing'} />
        <TopBarLink label={'Mise en page'} to={FrontendRoutes.layout()} data-cy={'layout'} />
        <TopBarLink label={'Documentation'} to={FrontendRoutes.documentation()} data-cy={'help'} />

        <div className={'ml-3'}>
          <Dropdown data-cy={'user-menu'}>
            <Dropdown.Toggle variant="light">
              <i className={'fa fa-user'} />
            </Dropdown.Toggle>
            <Dropdown.Menu className={Cls.dropDown}>
              <Dropdown.ItemText data-cy={'user-label'}>{userLabel}</Dropdown.ItemText>
              <Dropdown.Divider />
              {!userAuthenticated && (
                <>
                  <Dropdown.Item onClick={this.handleRegister}>S&apos;inscrire</Dropdown.Item>
                  <Dropdown.Item onClick={this.handleLogin}>Se connecter</Dropdown.Item>
                  <Dropdown.Item onClick={this.handlePasswordLost}>Mot de passe perdu</Dropdown.Item>
                </>
              )}
              <Dropdown.Item onClick={this.handleLogout} disabled={!userAuthenticated} data-cy={'logout'}>
                <i className={'fa fa-lock mr-2'} /> Se déconnecter
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  }

  private handleLogin = () => {
    const { modals, toasts } = this.props.services;

    modals.login().catch((err) => {
      logger.error('Cannot open login modal', err);
      toasts.genericError();
    });
  };

  private handlePasswordLost = () => {
    const { modals, toasts } = this.props.services;

    modals.passwordLost().catch((err) => {
      logger.error('Cannot open login modal', err);
      toasts.genericError();
    });
  };

  private handleRegister = () => {
    const { modals, toasts } = this.props.services;

    modals.registration().catch((err) => {
      logger.error('Cannot open registration modal', err);
      toasts.genericError();
    });
  };

  private handleLogout = () => {
    const { project, authentication, toasts, history } = this.props.services;

    project.newProject();
    history.clean();
    authentication
      .logout()
      .then(() => toasts.info("Vous n'êtes plus connecté !"))
      .catch((err) => {
        toasts.genericError();
        logger.error(err);
      });
  };
}

export default connector(withRouter(withServices(TopBar)));
