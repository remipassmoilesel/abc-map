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
import { AbcVoteAggregation, Logger, UserStatus } from '@abc-map/shared';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { ServiceProps, withServices } from '../../core/withServices';
import { DateTime } from 'luxon';
import Illustration1Icon from '../../assets/illustrations/illustration-1.svg';
import Illustration2Icon from '../../assets/illustrations/illustration-2.svg';
import Illustration3Icon from '../../assets/illustrations/illustration-3.svg';
import { BUILD_INFO } from '../../build-version';
import { MainState } from '../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { pageSetup } from '../../core/utils/page-setup';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import sample from 'lodash/sample';
import { Routes } from '../../routes';
import { FaIcon } from '../../components/icon/FaIcon';
import { IconDefs } from '../../components/icon/IconDefs';
import Cls from './LandingView.module.scss';

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

const t = prefixedTranslation('LandingView:');

class LandingView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      illustration: sample([Illustration1Icon, Illustration2Icon, Illustration3Icon]) as string,
    };
  }

  public render(): ReactNode {
    const voteAggregation = this.state.voteAggregation;
    const authenticated = this.props.authenticated;
    const illustration = this.state.illustration;
    const buildHash = BUILD_INFO.hash;

    return (
      <div className={Cls.landing}>
        <div className={Cls.leftColumn}>
          {/* Introduction */}

          <div>
            <h1>{t('Welcome')}</h1>

            <p className={Cls.intro}>{t('AbcMap_is_a_free_software')}</p>
          </div>

          <div>
            <h3>{t('How_does_it_work')}</h3>
            <ul className={'mt-3'}>
              <li>
                <a href={'https://www.youtube.com/channel/UCrlsEykrLNpK12Id7c7GP7g'} target={'_blank'} rel="noreferrer">
                  {t('Watch_a_presentation_video')} 📹
                </a>
                &nbsp; <Link to={Routes.documentation().format()}>{t('or_read_the_doc')} 📖</Link>
              </li>
              <li>
                <Link to={Routes.map().format()}>{t('Then_open_map')} 🌍</Link>
              </li>
            </ul>
            <div className={'mt-4'}>
              <button className={'btn btn-primary'} onClick={this.handleGoToMap}>
                <FaIcon icon={IconDefs.faRocket} className={'mr-2'} />
                {t('Lets_go')}
              </button>
            </div>

            {/* Current version */}

            <div className={Cls.version}>Version {buildHash}</div>
          </div>

          {/* Login and registration */}

          {!authenticated && (
            <div>
              <h3>{t('Registration_Login')}</h3>
              <p className={'mb-4'}>{t('Connection_is_optional')} 😉</p>
              <div>
                <button className={'btn btn-outline-primary'} onClick={this.handleRegister} data-cy={'open-registration'}>
                  <FaIcon icon={IconDefs.faFeatherAlt} className={'mr-3'} />
                  {t('Register')}
                </button>
                <button className={'btn btn-outline-primary'} onClick={this.handleLogin} data-cy={'open-login'}>
                  <FaIcon icon={IconDefs.faLockOpen} className={'mr-3'} />
                  {t('Login')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={Cls.rightColumn}>
          {/* Some pretty illustration */}

          <img src={illustration} alt={t('A_pretty_illustration')} className={Cls.illustration} />

          {/* Vote results */}

          {!!voteAggregation?.total && (
            <div className={'text-right'}>
              {t('For_7_days_opinions_are_positive', { votes: voteAggregation.satisfied })}&nbsp;
              {voteAggregation.satisfied < 60 && (
                <>
                  {t('Will_have_to_do_better')} <span className={'ml-2'}>🧑‍🏭</span>
                </>
              )}
              {voteAggregation.satisfied >= 60 && (
                <>
                  {t('Champagne')} <span className={'ml-2'}>🎉</span>
                </>
              )}
            </div>
          )}

          <div className={'mt-3'}>
            <Link to={Routes.legalMentions().format()}>{t('About_this_platform')}&nbsp;&nbsp;⚖️</Link>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(t('Free_open_source_mapping'), t('AbcMap_new_version'));

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

    history.push(Routes.map().format());
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

export default withTranslation()(connector(withRouter(withServices(LandingView))));
