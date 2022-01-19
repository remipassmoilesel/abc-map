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
import { Logger, UserStatus } from '@abc-map/shared';
import { MainState } from '../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { ServiceProps, withServices } from '../../../core/withServices';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { Routes } from '../../../routes';
import { FaIcon } from '../../icon/FaIcon';
import { IconDefs } from '../../icon/IconDefs';
import { ExperimentalFeatures } from '../../../ExperimentalFeatures';
import ExperimentalFeaturesModal from '../experimental-features/ExperimentalFeaturesModal';
import Cls from './UserMenu.module.scss';

const logger = Logger.get('UserMenu.tsx');

const mapStateToProps = (state: MainState) => ({
  userStatus: state.authentication.userStatus,
  user: state.authentication.user,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<any> & ServiceProps;

interface State {
  experimentalFeaturesModal: boolean;
}

const t = prefixedTranslation('UserMenu:');

class UserMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { experimentalFeaturesModal: false };
  }

  public render() {
    const userAuthenticated = this.props.userStatus === UserStatus.Authenticated;
    const user = this.props.user;
    const userLabel = user && userAuthenticated ? user.email : t('Hello_visitor');
    const experimentalFeaturesMenuEntry = ExperimentalFeatures.length > 0;
    const experimentalFeaturesModal = this.state.experimentalFeaturesModal;

    return (
      <>
        <Dropdown className={Cls.userMenu} align={'end'}>
          <Dropdown.Toggle variant="light" data-cy={'user-menu'}>
            <FaIcon icon={IconDefs.faUserCircle} size={'1.7rem'} />
          </Dropdown.Toggle>
          <Dropdown.Menu className={Cls.dropDown}>
            <Dropdown.ItemText data-cy={'user-label'}>{userLabel}</Dropdown.ItemText>
            <Dropdown.Divider />
            {!userAuthenticated && (
              <>
                <Dropdown.Item onClick={this.handleLogin}>
                  <FaIcon icon={IconDefs.faLockOpen} className={'mr-3'} />
                  {t('Login')}
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleRegister}>
                  <FaIcon icon={IconDefs.faFeather} className={'mr-3'} />
                  {t('Register')}
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handlePasswordLost} data-cy={'reset-password'}>
                  <FaIcon icon={IconDefs.faKey} className={'mr-3'} />
                  {t('Lost_password')}
                </Dropdown.Item>
              </>
            )}
            {userAuthenticated && (
              <>
                <Dropdown.Item onClick={this.handleUserAccount} data-cy={'user-profile'}>
                  <FaIcon icon={IconDefs.faCogs} className={'mr-3'} /> {t('My_account')}
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleLogout} data-cy={'logout'}>
                  <FaIcon icon={IconDefs.faLock} className={'mr-3'} /> {t('Logout')}
                </Dropdown.Item>
              </>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={this.handleFeedback}>
              <FaIcon icon={IconDefs.faComments} className={'mr-3'} />
              {t('Feedbacks')}
            </Dropdown.Item>

            {experimentalFeaturesMenuEntry && (
              <Dropdown.Item onClick={this.handleExperimentalFeaturesModal}>
                <FaIcon icon={IconDefs.faFlask} className={'mr-3'} />
                {t('Experimental_features')}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>

        {experimentalFeaturesModal && <ExperimentalFeaturesModal visible={experimentalFeaturesModal} onClose={this.experimentalFeaturesModalClosed} />}
      </>
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
    this.props.history.push(Routes.userAccount().format());
  };

  private handleLogout = () => {
    const { project, authentication, toasts } = this.props.services;

    project
      .newProject()
      .then(() => authentication.logout())
      .then(() => {
        toasts.info(`${t('You_are_disconnected')} 👋`);
        this.props.history.push(Routes.landing().format());
      })
      .catch((err) => {
        toasts.genericError();
        logger.error('Logout error: ', err);
      });
  };

  private handleFeedback = () => {
    const { modals } = this.props.services;

    modals.textFeedback().catch((err) => logger.error('Feedback modal error: ', err));
  };

  private handleExperimentalFeaturesModal = () => {
    this.setState({ experimentalFeaturesModal: true });
  };

  private experimentalFeaturesModalClosed = () => {
    this.setState({ experimentalFeaturesModal: false });
  };
}

export default withTranslation()(withServices(connector(withRouter(UserMenu))));
