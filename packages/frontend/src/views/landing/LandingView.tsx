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
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/frontend-commons';
import { AbcVoteAggregation, RegistrationStatus } from '@abc-map/shared-entities';
import LoginForm from './login/LoginForm';
import RegistrationForm from './registration/RegistrationForm';
import { ServiceProps, withServices } from '../../core/withServices';
import Cls from './LandingView.module.scss';
import { DateTime } from 'luxon';

const logger = Logger.get('Landing.tsx', 'info');

interface State {
  voteAggregation?: AbcVoteAggregation;
}

declare type Props = RouteComponentProps<any, any> & ServiceProps;

class LandingView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const voteAggregation = this.state.voteAggregation;
    return (
      <div className={Cls.landing}>
        {/* Introduction */}

        <h1>Bienvenue !</h1>
        <p className={Cls.intro}>
          Abc-Map est un logiciel libre de cartographie.
          <br />
          Abc-Map vous permet de créer des cartes simplement, sans connaissances techniques.
        </p>
        <p>Pour créer votre première carte efficacement:</p>
        <ul>
          <li>
            Prenez le temps de consulter <Link to={FrontendRoutes.documentation()}>la page Documentation</Link>
          </li>
          <li>
            Commencez à créer sur la page <Link to={FrontendRoutes.map()}>la page Carte</Link>, importez des données à partir de votre navigateur ou{' '}
            <Link to={FrontendRoutes.dataStore()}>sur la page Catalogue de données</Link>
          </li>
          <li>
            Si vous le souhaitez, appliquez un traitement de données sur <Link to={FrontendRoutes.dataProcessing('')}>la page Traitement de données</Link>
          </li>
          <li>
            Mettez en page et exportez votre carte sur <Link to={FrontendRoutes.layout()}>la page Mise en page</Link>
          </li>
        </ul>

        {/* Authentication */}

        <LoginForm onSubmit={this.authentication} />

        {/* Registration */}

        <RegistrationForm onSubmit={this.registration} />

        {/* Vote results */}

        {!!voteAggregation?.total && (
          <>
            <p>
              Sur les 7 derniers jours, {voteAggregation.satisfied} % des utilisateurs ont déclaré être satisfait !
              <br />
              {voteAggregation.satisfied < 30 && "C'est pas top top, mais que font les développeurs ?"}
              {voteAggregation.satisfied < 60 && 'Hmmm, va falloir faire mieux !'}
              {voteAggregation.satisfied >= 60 && 'Pas mal non ?'}
              &nbsp;({voteAggregation.total} participant(s))
            </p>
          </>
        )}
      </div>
    );
  }

  public componentDidMount() {
    const { vote } = this.props.services;

    const from = DateTime.now().minus({ days: 7 });
    const to = DateTime.now();
    vote
      .getStats(from, to)
      .then((res) => this.setState({ voteAggregation: res }))
      .catch((err) => logger.error(err));
  }

  private authentication = (email: string, password: string) => {
    const { toasts, authentication } = this.props.services;
    if (!email || !password) {
      toasts.info("Vous devez d'abord saisir votre email et votre mot de passe");
      return;
    }

    authentication
      .login(email, password)
      .then(() => this.props.history.push(FrontendRoutes.map()))
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };

  private registration = (email: string, password: string) => {
    const { toasts, authentication } = this.props.services;

    authentication
      .register(email, password)
      .then((res) => {
        if (res.status === RegistrationStatus.EmailAlreadyExists) {
          return toasts.info('Cette adresse email est déjà prise');
        }
        if (res.status === RegistrationStatus.Successful) {
          return toasts.info('Un email vient de vous être envoyé, vous devez activer votre compte');
        }
        toasts.genericError();
      })
      .catch((err) => {
        toasts.genericError();
        logger.error(err);
      });
  };
}

export default withRouter(withServices(LandingView));
