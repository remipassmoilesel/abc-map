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
import { AbcVoteAggregation } from '@abc-map/shared-entities';
import { ServiceProps, withServices } from '../../core/withServices';
import { DateTime } from 'luxon';
import Illustration1Icon from '../../assets/illustrations/illustration-1.svg';
import Illustration2Icon from '../../assets/illustrations/illustration-2.svg';
import Illustration3Icon from '../../assets/illustrations/illustration-3.svg';
import * as _ from 'lodash';
import Cls from './LandingView.module.scss';
import { BUILD_INFO } from '../../build-version';

const logger = Logger.get('Landing.tsx', 'info');

interface State {
  voteAggregation?: AbcVoteAggregation;
  illustration: string;
}

declare type Props = RouteComponentProps<any, any> & ServiceProps;

class LandingView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      illustration: _.sample([Illustration1Icon, Illustration2Icon, Illustration3Icon]) as string,
    };
  }

  public render(): ReactNode {
    const voteAggregation = this.state.voteAggregation;
    return (
      <div className={Cls.landing}>
        <div className={'d-flex flex-column'}>
          <div>
            <h1>Bienvenue !</h1>

            {/* Introduction */}

            <p className={Cls.intro}>
              Abc-Map est un logiciel libre de cartographie.
              <br />
              Abc-Map vous permet de créer des cartes simplement, sans connaissances techniques.
            </p>
            <ul>
              <li>
                Vous pouvez tout de suite vous lancer sur <Link to={FrontendRoutes.map()}>la page Carte</Link> !
              </li>
              <li>
                ... mais vous feriez bien de prendre quelques minutes pour consulter <Link to={FrontendRoutes.documentation()}>la page Documentation</Link>
              </li>
              <li>
                Importez des données de votre ordinateur ou <Link to={FrontendRoutes.dataStore()}>sur la page Catalogue de données</Link>
              </li>
              <li>
                Si vous le souhaitez, appliquez un traitement de données sur <Link to={FrontendRoutes.dataProcessing('')}>la page Traitement de données</Link>
              </li>
              <li>
                Mettez en page et exportez votre carte sur <Link to={FrontendRoutes.layout()}>la page Mise en page</Link>
              </li>
            </ul>

            {/* Vote results */}

            {!!voteAggregation?.total && (
              <>
                <p>
                  Sur les 7 derniers jours, {voteAggregation.satisfied} % des utilisateurs ont déclaré être satisfait !
                  <br />
                  {voteAggregation.satisfied < 30 && "C'est pas top top, mais que font les développeurs ?"}
                  {voteAggregation.satisfied < 60 && 'Hmmm, va falloir faire mieux !'}
                  {voteAggregation.satisfied >= 60 && 'Pas mal non ?'}
                </p>
              </>
            )}
          </div>

          <div>
            {/* Login and registration */}

            <h3 className={'mt-5'}>Inscription, connexion</h3>
            <p className={'mt-4'}>
              La connexion est <i>facultative</i>, mais elle permet de sauvegarder ses cartes en ligne.
            </p>
            <div className={'mt-5'}>
              <button className={'btn btn-primary mr-3'} onClick={this.handleRegister} data-cy={'open-registration'}>
                <i className={'fa fa-feather-alt'} />
                S&apos;inscrire
              </button>
              <button className={'btn btn-primary mr-3'} onClick={this.handleLogin} data-cy={'open-login'}>
                <i className={'fa fa-lock-open'} />
                Se connecter
              </button>
            </div>
          </div>
        </div>
        <div className={'mt-5'}>
          {/* Some bullshit illustration */}

          <img src={this.state.illustration} alt={'Une belle illustration pour faire comme les vrais !'} className={Cls.illustration} />

          {/* Current version */}

          <div className={Cls.version}>
            Version {BUILD_INFO.hash} du {BUILD_INFO.date}. Bien vu !
          </div>
        </div>
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

  private handleLogin = () => {
    const { modals, toasts } = this.props.services;

    modals.login().catch((err) => {
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
}

export default withRouter(withServices(LandingView));
