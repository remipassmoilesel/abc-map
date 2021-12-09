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
import { Logger, UserStatus } from '@abc-map/shared';
import { ServiceProps, withServices } from '../../core/withServices';
import { MainState } from '../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import ChangePasswordForm from './ChangePasswordForm';
import DeleteAccountForm from './DeleteAccountForm';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { pageSetup } from '../../core/utils/page-setup';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './UserAccountView.module.scss';
import { Routes } from '../../routes';
import AccountInformations from './AccountInformations';

const logger = Logger.get('UserAccountView.tsx');

const mapStateToProps = (state: MainState) => ({
  user: state.authentication.user,
  status: state.authentication.userStatus,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<any> & ServiceProps;

const t = prefixedTranslation('UserAccountView:');

interface State {
  passwordFormVersion: number;
}

class UserAccountView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { passwordFormVersion: 0 };
  }

  public render(): ReactNode {
    const authenticated = this.props.user && this.props.status === UserStatus.Authenticated;
    const user = this.props.user;
    const passwordFormVersion = this.state.passwordFormVersion;

    return (
      <div className={Cls.userAccount}>
        <h1 className={'my-5'}>{t('My_account')}</h1>
        {!authenticated && (
          <div className={'my-5 d-flex flex-column align-items-center'}>
            <div className={'mb-4'}>{t('You_must_connect_to_display_your_account')}</div>
            <Link to={Routes.landing().format()} className={'btn btn-outline-primary'}>
              {t('Go_back_to_landing')}
            </Link>
          </div>
        )}

        {authenticated && user && (
          <div className={'container'}>
            <div className={'row'}>
              <div className={'col-xl-4 mb-3'}>
                <AccountInformations user={user} />
              </div>

              <div className={'col-xl-4 mb-3'}>
                <ChangePasswordForm key={passwordFormVersion} onSubmit={this.handleChangePassword} />
              </div>

              <div className={'col-xl-4 mb-3'}>
                <DeleteAccountForm onSubmit={this.handleDeleteAccount} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  public componentDidMount() {
    pageSetup('Mon compte');
  }

  private handleChangePassword = (previousPassword: string, newPassword: string) => {
    const { authentication, toasts } = this.props.services;

    authentication
      .updatePassword(previousPassword, newPassword)
      .then(() => {
        toasts.info(t('Password_updated'));
        this.setState({ passwordFormVersion: this.state.passwordFormVersion + 1 });
      })
      .catch((err) => logger.error('Cannot update password', err));
  };

  private handleDeleteAccount = (password: string) => {
    const { authentication, toasts } = this.props.services;
    authentication
      .deleteAccount(password)
      .then(() => {
        toasts.info(t('Your_account_has_been_deleted'));
        this.props.history.push(Routes.landing().format());
        return authentication.logout();
      })
      .catch((err) => logger.error('Cannot delete account: ', err));
  };
}

export default withTranslation()(connector(withServices(withRouter(UserAccountView))));
