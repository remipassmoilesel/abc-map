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
import { Logger, ConfirmAccountParams, FrontendRoutes } from '@abc-map/frontend-commons';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { AccountConfirmationStatus } from '@abc-map/shared-entities';
import * as qs from 'query-string';
import { ServiceProps, withServices } from '../../core/withServices';
import './ConfirmAccountView.scss';

const logger = Logger.get('ConfirmAccount.tsx', 'info');

interface State {
  status: AccountConfirmationStatus;
}

type Props = RouteComponentProps<ConfirmAccountParams> & ServiceProps;

class ConfirmAccountView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      status: AccountConfirmationStatus.InProgress,
    };
  }

  public render(): ReactNode {
    return (
      <div className={'abc-confirm-account'}>
        <h3>Activation de votre compte</h3>
        <div className={'message'}>
          {AccountConfirmationStatus.InProgress === this.state.status && <div>Veuillez patienter ...</div>}
          {AccountConfirmationStatus.UserNotFound === this.state.status && <div>Une erreur est survenue, essayez de vous inscrire à nouveau.</div>}
          {AccountConfirmationStatus.Failed === this.state.status && (
            <div>La confirmation a échoué, vous pouvez rafraichir cette page ou réessayer plus tard.</div>
          )}
          {AccountConfirmationStatus.Succeed === this.state.status && (
            <div data-cy={'account-enabled'}>
              Votre compte est activé. <Link to={FrontendRoutes.map()}>Direction: la carte !</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const { authentication } = this.props.services;

    const userId = this.props.match.params.userId;
    const secret = qs.parse(this.props.location.search).secret as string;
    if (!userId || !secret) {
      this.setState({ status: AccountConfirmationStatus.Failed });
    } else {
      authentication
        .confirmAccount(userId, secret)
        .then((res) => {
          if (res.error) {
            return Promise.reject(new Error(res.error));
          }
          this.setState({ status: res.status });
        })
        .catch((err) => {
          logger.error(err);
          this.setState({ status: AccountConfirmationStatus.Failed });
        });
    }
  }
}

export default withRouter(withServices(ConfirmAccountView));
