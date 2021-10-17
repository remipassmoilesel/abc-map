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
import { ConfirmAccountParams, ConfirmationStatus, FrontendRoutes, Logger } from '@abc-map/shared';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { ServiceProps, withServices } from '../../core/withServices';
import { HttpError } from '../../core/http/HttpError';
import { addNoIndexMeta, pageSetup, removeNoIndexMeta } from '../../core/utils/page-setup';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './ConfirmAccountView.module.scss';

const logger = Logger.get('ConfirmAccountView.tsx');

interface State {
  status: ConfirmationStatus;
}

type Props = RouteComponentProps<ConfirmAccountParams> & ServiceProps;

const t = prefixedTranslation('ConfirmAccountView:');

class ConfirmAccountView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      status: ConfirmationStatus.InProgress,
    };
  }

  public render(): ReactNode {
    const status = this.state.status;

    return (
      <div className={Cls.confirmAccount}>
        <h3 className={'mb-4'} dangerouslySetInnerHTML={{ __html: t('And_voila_welcome') }} />
        {/* Loading */}
        {ConfirmationStatus.InProgress === status && <div>{t('Please_wait')}</div>}

        {/* Account already confirmed */}
        {ConfirmationStatus.AlreadyConfirmed === status && <div dangerouslySetInnerHTML={{ __html: t('This_account_is_already_activated') }} />}

        {/* Account confirmation failed */}
        {ConfirmationStatus.Failed === status && <div dangerouslySetInnerHTML={{ __html: t('Activation_failed') }} />}

        {/* Account confirmation succeed */}
        {ConfirmationStatus.Succeed === status && (
          <div data-cy={'account-enabled'}>
            {t('Activation_succeed')} ✨<br />
            <Link to={FrontendRoutes.map().raw()}>{t('Map_is_over_here')}</Link>
          </div>
        )}
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(t('Registration_confirmation'));
    addNoIndexMeta();

    this.confirmRegistration();
  }

  public componentWillUnmount() {
    removeNoIndexMeta();
  }

  private confirmRegistration() {
    const { authentication, toasts } = this.props.services;

    const token = this.props.match.params.token;
    if (!token) {
      this.setState({ status: ConfirmationStatus.Failed });
    } else {
      authentication
        .confirmRegistration(token)
        .then((res) => this.setState({ status: res.status }))
        .catch((err) => {
          logger.error('Registration error: ', err);
          if (HttpError.isConflict(err)) {
            this.setState({ status: ConfirmationStatus.AlreadyConfirmed });
          } else if (HttpError.isUnauthorized(err)) {
            this.setState({ status: ConfirmationStatus.Failed });
          } else {
            toasts.httpError(err);
            this.setState({ status: ConfirmationStatus.Failed });
          }
        });
    }
  }
}

export default withTranslation()(withRouter(withServices(ConfirmAccountView)));
