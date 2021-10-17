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

import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FrontendRoutes, Logger, UserStatus } from '@abc-map/shared';
import { MainState } from '../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { ServiceProps, withServices } from '../../../core/withServices';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { prefixedTranslation } from '../../../i18n/i18n';
import Cls from '../TopBar.module.scss';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('UserMenu.tsx');

const mapStateToProps = (state: MainState) => ({
  userStatus: state.authentication.userStatus,
  user: state.authentication.user,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<any> & ServiceProps;

const t = prefixedTranslation('UserMenu:');

class UserMenu extends React.Component<Props, {}> {
  public render() {
    const userAuthenticated = this.props.userStatus === UserStatus.Authenticated;
    const user = this.props.user;
    const userLabel = user && userAuthenticated ? user.email : t('Hello_visitor');

    return (
      <Dropdown data-cy={'user-menu'}>
        <Dropdown.Toggle variant="light">
          <i className={'fa fa-user-circle'} />
        </Dropdown.Toggle>
        <Dropdown.Menu className={Cls.dropDown}>
          <Dropdown.ItemText data-cy={'user-label'}>{userLabel}</Dropdown.ItemText>
          <Dropdown.Divider />
          {!userAuthenticated && (
            <>
              <Dropdown.Item onClick={this.handleLogin}>
                <i className={'fa fa-lock-open mr-3'} />
                {t('Login')}
              </Dropdown.Item>
              <Dropdown.Item onClick={this.handleRegister}>
                <i className={'fa fa-feather mr-3'} />
                {t('Register')}
              </Dropdown.Item>
              <Dropdown.Item onClick={this.handlePasswordLost} data-cy={'reset-password'}>
                <i className={'fa fa-key mr-3'} />
                {t('Lost_password')}
              </Dropdown.Item>
            </>
          )}
          {userAuthenticated && (
            <>
              <Dropdown.Item onClick={this.handleUserAccount} data-cy={'user-profile'}>
                <i className={'fa fa-cogs mr-3'} />
                {t('My_account')}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={this.handleLogout} data-cy={'logout'}>
                <i className={'fa fa-lock mr-3'} /> {t('Logout')}
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
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

  private handleUserAccount = () => {
    this.props.history.push(FrontendRoutes.userAccount().raw());
  };

  private handleLogout = () => {
    const { project, authentication, toasts } = this.props.services;

    project
      .newProject()
      .then(() => authentication.logout())
      .then(() => {
        toasts.info(`${t('You_are_disconnected')} 👋`);
        this.props.history.push(FrontendRoutes.landing().raw());
      })
      .catch((err) => {
        toasts.genericError();
        logger.error(err);
      });
  };
}

export default withTranslation()(withServices(connector(withRouter(UserMenu))));
