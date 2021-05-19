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
import { ConfirmationStatus } from '@abc-map/shared-entities';
import { ServiceProps, withServices } from '../../core/withServices';
import Cls from './ConfirmAccountView.module.scss';

const logger = Logger.get('ConfirmAccount.tsx', 'info');

interface State {
  status: ConfirmationStatus;
}

type Props = RouteComponentProps<ConfirmAccountParams> & ServiceProps;

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
        <h3>Activation de votre compte</h3>
        {ConfirmationStatus.InProgress === status && <div>Veuillez patienter ...</div>}
        {ConfirmationStatus.Failed === status && (
          <div>L&apos;activation de votre compte a échoué, vous pouvez rafraichir cette page ou réessayer plus tard.</div>
        )}
        {ConfirmationStatus.Succeed === status && (
          <div data-cy={'account-enabled'}>
            Votre compte est activé, vous êtes connecté. <Link to={FrontendRoutes.map()}>Direction: la carte !</Link>
          </div>
        )}
      </div>
    );
  }

  public componentDidMount() {
    const { authentication } = this.props.services;

    const token = this.props.match.params.token;
    if (!token) {
      this.setState({ status: ConfirmationStatus.Failed });
    } else {
      authentication
        .confirmRegistration(token)
        .then((res) => this.setState({ status: res.status }))
        .catch((err) => {
          logger.error('Registration error: ', err);
          this.setState({ status: ConfirmationStatus.Failed });
        });
    }
  }
}

export default withRouter(withServices(ConfirmAccountView));
