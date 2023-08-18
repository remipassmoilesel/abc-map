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

import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { AbcVoteAggregation, Logger, UserStatus } from '@abc-map/shared';
import { Link, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import Illustration1 from '../../assets/illustrations/illustration-1.svg';
import Illustration2 from '../../assets/illustrations/illustration-2.svg';
import Illustration3 from '../../assets/illustrations/illustration-3.svg';
import { pageSetup } from '../../core/utils/page-setup';
import sample from 'lodash/sample';
import { Routes } from '../../routes';
import { FaIcon } from '../../components/icon/FaIcon';
import { IconDefs } from '../../components/icon/IconDefs';
import Cls from './LandingView.module.scss';
import { useAppSelector } from '../../core/store/hooks';
import { useServices } from '../../core/useServices';
import { useTranslation } from 'react-i18next';
import { BundledModuleId } from '@abc-map/shared';
import clsx from 'clsx';
import { VERSION } from '../../version';

const logger = Logger.get('LandingView.tsx');

interface Illustration {
  src: string;
  width: string;
  height: string;
}

const Illustrations: Illustration[] = [
  { src: Illustration1, width: 45 + 'vw', height: 33.75 + 'vw' },
  { src: Illustration2, width: 45 + 'vw', height: 33.75 + 'vw' },
  { src: Illustration3, width: 45 + 'vw', height: 33.75 + 'vw' },
];

function LandingView() {
  const { t } = useTranslation('LandingView');
  const { feedback, modals, toasts } = useServices();
  const navigate = useNavigate();
  const authenticated = useAppSelector((st) => st.authentication.userStatus) === UserStatus.Authenticated;
  const [voteAggregation, setVoteAggregation] = useState<AbcVoteAggregation | undefined>();

  const illustration = useMemo<Illustration>(() => sample(Illustrations) || Illustrations[0], []);
  const illustrationSize = useMemo<CSSProperties>(
    () => ({ width: illustration.width, height: illustration.height }),
    [illustration.height, illustration.width]
  );

  // Setup view
  useEffect(() => {
    pageSetup(t('Free_open_source_mapping'), t('AbcMap_new_version'));

    const from = DateTime.now().minus({ days: 7 });
    const to = DateTime.now();
    feedback
      .getStats(from, to)
      .then((res) => setVoteAggregation(res))
      .catch((err) => logger.error(err));
  }, [feedback, t]);

  const handleGoToMap = useCallback(() => navigate(Routes.map().format()), [navigate]);

  const handleLogin = useCallback(() => {
    modals.login().catch((err) => {
      logger.error('Cannot open login modal', err);
      toasts.genericError();
    });
  }, [modals, toasts]);

  const handleRegister = useCallback(() => {
    modals.registration().catch((err) => {
      logger.error('Cannot open registration modal', err);
      toasts.genericError();
    });
  }, [modals, toasts]);

  const satisfied = voteAggregation?.satisfied ?? 100;

  return (
    <div className={Cls.landing}>
      <div className={`container ${Cls.container}`}>
        <div className={'row'}>
          <div className={'col-xl-6 mt-5'}>
            {/* Title */}
            <h1 className={Cls.title}>Abc-Map</h1>
            <div className={Cls.intro}>{t('Open_source_extensible_online_mapping')}</div>

            {/* Explanation and start link */}
            <h3 className={'mb-3'}>{t('How_does_it_work')}</h3>

            <ul className={'mb-4'}>
              <li>
                <Link to={Routes.module().withParams({ moduleId: BundledModuleId.Documentation })}>{t('Browse_the_doc')} 📖</Link>
              </li>
              <li>
                <Link to={Routes.map().format()}>{t('Then_open_map')} 🌍</Link>
              </li>
            </ul>

            <div className={'d-flex flex-wrap'}>
              <button className={'btn btn-primary'} onClick={handleGoToMap}>
                <FaIcon icon={IconDefs.faRocket} className={'mr-2'} />
                {t('Lets_go')}
              </button>

              <div className={clsx(Cls.version)}>Your are running version {VERSION.hash.slice(0, 15)}</div>
            </div>

            {/* Authenticate and register buttons */}
            <div className={Cls.authenticationButtons}>
              <h3>{t('Registration_Login')}</h3>
              <p className={'mb-4'}>{t('Connection_is_optional')} 😉</p>
              <div>
                <button className={'btn btn-outline-primary'} onClick={handleRegister} data-cy={'open-registration'} disabled={authenticated}>
                  <FaIcon icon={IconDefs.faFeatherAlt} className={'mr-3'} />
                  {t('Register')}
                </button>
                <button className={'btn btn-outline-primary'} onClick={handleLogin} data-cy={'open-login'} disabled={authenticated}>
                  <FaIcon icon={IconDefs.faLockOpen} className={'mr-3'} />
                  {t('Login')}
                </button>
              </div>
            </div>

            {/* Vote results, legal mentions, current version */}
            <div className={Cls.bottomMentions}>
              {!!voteAggregation?.total && (
                <div className={'mb-2'}>
                  {t('For_7_days_opinions_are_positive', { votes: satisfied })}&nbsp;
                  {satisfied < 60 && (
                    <>
                      {t('Will_have_to_do_better')} <span className={'ml-2'}>🧑‍🏭</span>
                    </>
                  )}
                  {satisfied >= 60 && (
                    <>
                      {t('Champagne')} <span className={'ml-2'}>🎉</span>
                    </>
                  )}
                </div>
              )}

              <div className={'d-flex flex-wrap mb-2'}>
                <Link to={Routes.changelog().format()} className={'mr-3'}>
                  {t('What_changed')}&nbsp;&nbsp;👷🏿
                </Link>
                <Link to={Routes.legalMentions().format()}>{t('About_this_platform')}&nbsp;&nbsp;⚖️</Link>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div onClick={handleGoToMap} className={'col-xl-6 d-flex flex-column align-items-end justify-content-center'}>
            <img src={illustration.src} style={illustrationSize} alt={t('A_pretty_illustration')} className={Cls.illustration} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingView;
