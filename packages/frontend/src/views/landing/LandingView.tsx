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
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/shared';
import { AbcVoteAggregation } from '@abc-map/shared';
import { ServiceProps, withServices } from '../../core/withServices';
import { DateTime } from 'luxon';
import Illustration1Icon from '../../assets/illustrations/illustration-1.svg';
import Illustration2Icon from '../../assets/illustrations/illustration-2.svg';
import Illustration3Icon from '../../assets/illustrations/illustration-3.svg';
import * as _ from 'lodash';
import Cls from './LandingView.module.scss';
import { BUILD_INFO } from '../../build-version';
import { MainState } from '../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { pageSetup } from '../../core/utils/page-setup';

const logger = Logger.get('Landing.tsx');

const mapStateToProps = (state: MainState) => ({
  authenticated: state.authentication.userStatus === UserStatus.Authenticated,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<any, any> & ServiceProps;

interface State {
  voteAggregation?: AbcVoteAggregation;
  illustration: string;
}

class LandingView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      illustration: _.sample([Illustration1Icon, Illustration2Icon, Illustration3Icon]) as string,
    };
  }

  public render(): ReactNode {
    const voteAggregation = this.state.voteAggregation;
    const authenticated = this.props.authenticated;
    const illustration = this.state.illustration;
    const buildHash = BUILD_INFO.hash;
    const buildDate = DateTime.fromISO(BUILD_INFO.date).toLocal().toFormat('dd/MM/yyyy (HH:mm)');

    return (
      <div className={Cls.landing}>
        <div className={Cls.leftColumn}>
          {/* Introduction */}

          <div>
            <h1>Bienvenue !</h1>

            <p className={Cls.intro}>Abc-Map est un logiciel de cartographie libre et gratuit.</p>
          </div>

          <div>
            <h3>Comment ça marche ?</h3>
            <ul className={'mt-3'}>
              <li>
                Regardez une&nbsp;
                <a href={'https://www.youtube.com/channel/UCrlsEykrLNpK12Id7c7GP7g'} target={'_blank'} rel="noreferrer">
                  vidéo de présentation 📹
                </a>
                &nbsp; ou parcourez la <Link to={FrontendRoutes.documentation().raw()}>documentation 📖</Link>
              </li>
              <li>
                Puis lancez-vous sur la <Link to={FrontendRoutes.map().raw()}>carte 🌍</Link>
              </li>
            </ul>
            <div className={'mt-4'}>
              <button className={'btn btn-primary'} onClick={this.handleGoToMap}>
                <i className={'fa fa-rocket mr-2'} />
                Commencer
              </button>
            </div>

            {/* Current version */}

            <div className={Cls.version}>
              Version {buildHash} du {buildDate}. Bien vu !
            </div>
          </div>

          {/* Login and registration */}

          {!authenticated && (
            <div>
              <h3>Inscription, connexion</h3>
              <p className={'mb-4'}>La connexion est facultative ! Vous pouvez utiliser Abc-Map sans vous inscrire 😉</p>
              <div>
                <button className={'btn btn-outline-primary'} onClick={this.handleRegister} data-cy={'open-registration'}>
                  <i className={'fa fa-feather-alt mr-3'} />
                  S&apos;inscrire
                </button>
                <button className={'btn btn-outline-primary'} onClick={this.handleLogin} data-cy={'open-login'}>
                  <i className={'fa fa-lock-open mr-3'} />
                  Se connecter
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={Cls.rightColumn}>
          {/* Some bullshit (but pretty !) illustration */}

          <img src={illustration} alt={'Une belle illustration pour faire comme les vrais !'} className={Cls.illustration} />

          {/* Vote results */}

          {!!voteAggregation?.total && (
            <div className={'text-right'}>
              Depuis 7 jours, {voteAggregation.satisfied} % des votes sont positifs.&nbsp;
              {voteAggregation.satisfied < 60 && (
                <>
                  Va falloir faire mieux <span className={'ml-2'}>🧑‍🏭</span>
                </>
              )}
              {voteAggregation.satisfied >= 60 && (
                <>
                  Champagne ! <span className={'ml-2'}>🎉</span>
                </>
              )}
            </div>
          )}

          <div className={'mt-3'}>
            <Link to={FrontendRoutes.legalMentions().raw()}>A propos de cette plateforme&nbsp;&nbsp;⚖️</Link>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(
      'Cartographie libre et gratuite en ligne',
      `Abc-Map, nouvelle version 🚀 Créez des cartes géographiques simplement: importez, dessinez, visualisez des données, et bien plus !`
    );

    const { vote } = this.props.services;

    const from = DateTime.now().minus({ days: 7 });
    const to = DateTime.now();
    vote
      .getStats(from, to)
      .then((res) => this.setState({ voteAggregation: res }))
      .catch((err) => logger.error(err));
  }

  public handleGoToMap = () => {
    const { history } = this.props;

    history.push(FrontendRoutes.map().raw());
  };

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

export default connector(withRouter(withServices(LandingView)));
