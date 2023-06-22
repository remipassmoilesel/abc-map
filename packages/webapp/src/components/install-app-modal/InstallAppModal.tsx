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

import Cls from './InstallAppModal.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import mainLogo from '../../assets/main-icon.png';
import { useTranslation, withTranslation } from 'react-i18next';
import { usePwaInstallReadiness } from '../../core/pwa/PwaInstallReadinessContext';
import { useServices } from '../../core/useServices';
import { Logger } from '@abc-map/shared';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { UiActions } from '../../core/store/ui/actions';
import { BlueLoader } from '../blue-loader/BlueLoader';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import clsx from 'clsx';
import { ModalEventType } from '../../core/ui/typings';
import { confetti } from '../../core/ui/confetti';
import { FullscreenModal } from '../fullscreen-modal/FullscreenModal';
import * as Bowser from 'bowser';

const logger = Logger.get('InstallAppModal.tsx');

enum InstallationState {
  NotInstallable = 'NotInstallable',
  NotInstalled = 'NotInstalled',
  Installing = 'Installing',
  Installed = 'Installed',
  Error = 'Error',
}

const bowser = Bowser.getParser(window.navigator.userAgent);
const mobile = bowser.getPlatform().type !== 'desktop';
const browser = bowser.getBrowserName(true);

function InstallAppModal() {
  const { t } = useTranslation('InstallAppModal');
  const { pwa, toasts, modals } = useServices();
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState(InstallationState.NotInstallable);
  const appInstallReady = usePwaInstallReadiness();
  const visits = useAppSelector((st) => st.ui.visits);
  const dismissed = useAppSelector((st) => st.ui.informations.installApp);
  const dispatch = useAppDispatch();

  // Make visible if installation is possible
  // We do not pop installation modal on first visit, in order to prevent too many prompts
  useEffect(() => {
    const visible = appInstallReady && visits > 1 && !dismissed;

    logger.debug('Installation modal: ', { visible, appInstallReady, visitsUp0: visits > 0, dismissed });
    setState(appInstallReady ? InstallationState.NotInstalled : InstallationState.NotInstallable);
    setVisible(visible);
  }, [dismissed, appInstallReady, visits]);

  // Listen for modal service
  useEffect(() => {
    const listener = () => {
      setVisible(true);
      setState(appInstallReady ? InstallationState.NotInstalled : InstallationState.NotInstallable);
    };

    modals.addListener(ModalEventType.ShowPwaInstall, listener);
    return () => modals.removeListener(ModalEventType.ShowPwaInstall, listener);
  }, [appInstallReady, modals]);

  const handleInstallApp = useCallback(() => {
    setState(InstallationState.Installing);
    pwa
      .install()
      .then(() => {
        setState(InstallationState.Installed);
        window.resizeTo(window.screen.availWidth, window.screen.availHeight);
        setTimeout(() => confetti(), 300);
        setTimeout(() => setVisible(false), 2000);
      })
      .catch((err) => {
        toasts.genericError(err);
        logger.error('App install error: ', err);
        setState(InstallationState.Error);
      });
  }, [pwa, toasts]);

  const handleClose = useCallback(() => setVisible(false), []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    dispatch(UiActions.ackInformation('installApp'));
  }, [dispatch]);

  if (!visible) {
    return <div />;
  }

  return (
    <FullscreenModal className={Cls.modal}>
      <img src={mainLogo} alt={'Abc-Map'} />

      <div className={Cls.container}>
        {/* App not installable yet, user should wait for event */}
        {InstallationState.NotInstallable === state && browser !== 'firefox' && (
          <>
            <h1 className={Cls.title}>{t('Install_app')}</h1>

            <h3 className={'mb-4'}>{t('You_cant_install_the_app_now')} 🤔</h3>

            <div className={'d-flex flex-column align-items-center mb-4'}>
              {t('Its_probably_because')}
              <div>• {t('App_is_already_installed')}</div>
              <div>• {t('Or_you_are_using_an_unsupported_device')}</div>
            </div>

            <div className={'d-flex justify-content-center'}>
              <button onClick={handleDismiss} className={'btn btn-primary'}>
                {t('Close')}
              </button>
            </div>
          </>
        )}

        {/* User uses Firefox on mobile, we recommend him to use "Add to home screen" */}
        {InstallationState.NotInstallable === state && browser === 'firefox' && mobile && (
          <>
            <h1 className={Cls.title}>{t('Install_app')}</h1>

            <h3 className={'mb-4'}>{t('Just_one_more_step')} ✨</h3>

            <div className={clsx(Cls.explanation, 'mb-4')}>
              <div>• {t('Tap_the_menu_button_next_to_the_address_bar')}</div>
              <div>• {t('Then_tap_Add_to_Home_screen')}</div>

              <a href={'https://support.mozilla.org/en-US/kb/add-web-page-shortcuts-your-home-screen'} target={'_blank'} rel="noreferrer" className={'my-2'}>
                {t('See_firefox_documentation')}
              </a>
            </div>

            <div className={'d-flex justify-content-center'}>
              <button onClick={handleDismiss} className={'btn btn-primary'}>
                {t('Close')}
              </button>
            </div>
          </>
        )}

        {/* User uses Firefox on desktop, we recommend him to use an extension */}
        {InstallationState.NotInstallable === state && browser === 'firefox' && !mobile && (
          <>
            <h1 className={Cls.title}>{t('Install_app')}</h1>

            <div className={clsx(Cls.explanation, 'mb-4')}>
              <a href={'https://addons.mozilla.org/en-US/firefox/addon/pwas-for-firefox/'} target={'_blank'} rel="noreferrer" className={'my-3 text-center'}>
                {t('To_install_the_application_you_will_need_this_extension')}
                <FaIcon icon={IconDefs.faLink} className={'ml-2'} />
              </a>
            </div>

            <div className={'d-flex justify-content-center'}>
              <button onClick={handleDismiss} className={'btn btn-primary'}>
                {t('Close')}
              </button>
            </div>
          </>
        )}

        {InstallationState.NotInstalled === state && (
          <>
            <h1 className={Cls.title}>{t('Install_app')}</h1>

            <div className={clsx(Cls.explanation)}>
              <div>{t('You_can_then_start_Abc-Map_from_your_home_screen')}</div>
              <small className={'mb-5'}>{t('This_app_respects_your_privacy_just_like_the_online_version')}</small>
            </div>

            <div className={'d-flex justify-content-center mb-4'}>
              <button onClick={handleInstallApp} className={'btn btn-primary'}>
                <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
                {t('Install')}
              </button>
              <button onClick={handleClose} className={'btn btn-outline-secondary'}>
                <FaIcon icon={IconDefs.faTimes} className={'mr-2'} />
                {t('Not_now')}
              </button>
            </div>

            <div className={'d-flex justify-content-center'}>
              <button onClick={handleDismiss} className={'btn btn-link'}>
                {t('Do_not_ask_again')}
              </button>
            </div>
          </>
        )}

        {InstallationState.Installing === state && <BlueLoader />}

        {InstallationState.Installed === state && (
          <div className={'d-flex flex-column justify-content-center align-items-center'}>
            <h2 className={'mb-4'}>{t('Done')} 🥳</h2>
            <small>{t('You_may_have_to_wait_a_bit_or_close_this_page')}</small>
          </div>
        )}

        {InstallationState.Error === state && (
          <>
            <h2>{t('Something_went_wrong')}</h2>
            <h4>{t('Damn_bugs')} 🐛</h4>
            <h4>{t('Maybe_its_already_installed')}</h4>

            <div className={'d-flex justify-content-center'}>
              <button onClick={handleDismiss} className={'btn btn-primary'}>
                {t('Close')}
              </button>
            </div>
          </>
        )}
      </div>
    </FullscreenModal>
  );
}

export default withTranslation()(InstallAppModal);
