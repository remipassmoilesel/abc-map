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
import { FrontendRoutes, Logger, UserStatus } from '@abc-map/shared';
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

const logger = Logger.get('UserAccountView.tsx');

const mapStateToProps = (state: MainState) => ({
  user: state.authentication.user,
  status: state.authentication.userStatus,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<any> & ServiceProps;

const t = prefixedTranslation('UserAccountView:');

class UserAccountView extends Component<Props, {}> {
  public render(): ReactNode {
    const authenticated = this.props.user && this.props.status === UserStatus.Authenticated;
    const user = this.props.user;

    return (
      <div className={Cls.userAccount}>
        <h1 className={'mb-4'}>{t('My_account')}</h1>
        {!authenticated && (
          <div className={'my-5 d-flex flex-column align-items-center'}>
            <div className={'mb-4'}>{t('You_must_connect_to_display_your_account')}</div>
            <Link to={FrontendRoutes.landing().raw()} className={'btn btn-outline-primary'}>
              {t('Go_back_to_landing')}
            </Link>
          </div>
        )}
        {authenticated && user && (
          <div className={Cls.cardContainer}>
            <div className={Cls.section}>
              <div className={'card card-body'}>
                <h2>{t('My_informations')}</h2>
                <div className={'mb-2'}>{t('Email_address')}:</div>
                <input type={'email'} readOnly={true} value={user.email} className={'form-control'} />
                <small className={'mt-2'}>{t('Email_is_readonly')}</small>
                <div className={'mt-4'}>{t('Nothing_more')}</div>
              </div>
            </div>

            <div className={Cls.section}>
              <ChangePasswordForm onSubmit={this.handleChangePassword} />
            </div>
            <div className={Cls.section}>
              <DeleteAccountForm onSubmit={this.handleDeleteAccount} />
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
      .then(() => toasts.info(t('Password_updated')))
      .catch((err) => logger.error('Cannot update password', err));
  };

  private handleDeleteAccount = (password: string) => {
    const { authentication, toasts } = this.props.services;
    authentication
      .deleteAccount(password)
      .then(() => {
        toasts.info(t('Your_account_has_been_deleted'));
        this.props.history.push(FrontendRoutes.landing().raw());
        return authentication.logout();
      })
      .catch((err) => logger.error('Cannot delete account: ', err));
  };
}

export default withTranslation()(connector(withServices(withRouter(UserAccountView))));
