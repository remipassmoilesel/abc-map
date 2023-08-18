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

import React, { useCallback, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { IconDefs } from '../../icon/IconDefs';
import { ExperimentalFeatures } from '../../../experimental-features';
import ExperimentalFeaturesModal from './experimental-features/ExperimentalFeaturesModal';
import { useServices } from '../../../core/useServices';
import { useRunningAsPwa } from '../../../core/pwa/useRunningAsPwa';
import { useTranslation } from 'react-i18next';
import { useFullscreen } from '../../../core/ui/useFullscreen';
import { ActionButton } from '../action-button/ActionButton';
import { FaIcon } from '../../icon/FaIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useServiceWorker } from '../../../core/pwa/useServiceWorker';
import { Link } from 'react-router-dom';
import { Routes } from '../../../routes';
import { ModalStatus } from '../../../core/ui/typings';

const logger = Logger.get('AppSection.tsx');

export function AppSection() {
  const { t } = useTranslation('TopBar');
  const { project, modals, storage, toasts, authentication } = useServices();
  const [experimentalFeaturesModal, setExperimentalFeaturesModal] = useState(false);
  const experimentalFeaturesMenuEntry = ExperimentalFeatures.length > 0;
  const runningAsPwa = useRunningAsPwa();

  const handleInstallApp = useCallback(() => {
    modals.pwaInstall().catch((err) => logger.error('Cannot show app modal: ', err));
  }, [modals]);

  const handleFeedback = useCallback(() => modals.textFeedback().catch((err) => logger.error('Feedback modal error: ', err)), [modals]);

  const handleExperimentalFeaturesModal = useCallback(() => setExperimentalFeaturesModal(true), []);
  const handleExperimentalFeaturesModalClosed = useCallback(() => setExperimentalFeaturesModal(false), []);

  const { fullscreen, toggleFullscreen } = useFullscreen();

  const [fullscreenInfoDismissed, setFullscreenInfoDismissed] = useState(false);

  const handleDismissInfo = useCallback(() => setFullscreenInfoDismissed(true), []);

  const swState = useServiceWorker();
  const worksOffline = swState.present || swState.installed;

  const handleClearData = useCallback(
    () =>
      modals
        .modificationsLostConfirmation()
        .then((result) => {
          if (ModalStatus.Confirmed === result) {
            return project
              .newProject()
              .then(() => authentication.logout())
              .then(() => storage.clear());
          }
        })
        .catch((err) => {
          logger.error('Clear storage error: ', err);
          toasts.genericError(err);
        }),
    [authentication, modals, project, storage, toasts]
  );

  return (
    <>
      <div className={'d-flex flex-wrap mb-4'}>
        {!runningAsPwa && (
          <>
            {/* Install app */}
            <ActionButton label={t('Install_app')} icon={IconDefs.faDownload} onClick={handleInstallApp} />

            {/* Toggle fullscreen */}
            <ActionButton label={t('Toggle_fullscreen')} icon={fullscreen ? IconDefs.faCompressAlt : IconDefs.faExpandAlt} onClick={toggleFullscreen} />
          </>
        )}

        {/* Feedback */}
        <ActionButton label={t('Feedbacks')} icon={IconDefs.faComments} onClick={handleFeedback} />

        {experimentalFeaturesMenuEntry && (
          <ActionButton label={t('More_features')} icon={IconDefs.faFlask} onClick={handleExperimentalFeaturesModal} data-cy={'experimental-features'} />
        )}

        <ActionButton label={t('Clear_local_app_data')} icon={IconDefs.faTrash} onClick={handleClearData} />
      </div>

      <div className={'d-flex flex-wrap ps-2 mb-4'}>
        <Link to={Routes.changelog().format()} className={'mr-3'}>
          {t('What_changed')}&nbsp;&nbsp;👷🏿
        </Link>
        <Link to={Routes.legalMentions().format()}>{t('About_this_platform')}&nbsp;&nbsp;⚖️</Link>
      </div>

      <div className={'ps-2 mb-2'}>
        {!runningAsPwa && (
          <>
            {worksOffline && (
              <div className={'alert alert-light border rounded w-100 mb-2'}>
                <FaIcon icon={IconDefs.faInfoCircle} className={'mr-2'} />
                {t('You_can_use_abc-map_offline')}
              </div>
            )}

            {!worksOffline && (
              <div className={'alert alert-light border rounded w-100 mb-2'}>
                <FaIcon icon={IconDefs.faExclamationTriangle} className={'me-2'} />
                {t('You_cannot_use_abc-map_offline')}
              </div>
            )}
          </>
        )}

        {swState.updateAvailable && (
          <div className={'alert alert-light border rounded w-100 mb-2'}>
            <FaIcon icon={IconDefs.faDownload} className={'me-2'} />
            {t('New_version_available_Restart_Abc-Map')} 🤩
          </div>
        )}

        {/* Information about fullscreen */}
        {!runningAsPwa && !fullscreen && !fullscreenInfoDismissed && (
          <div className={'alert alert-light border rounded d-flex justify-content-between align-items-center p-1 mb-2'}>
            <button onClick={toggleFullscreen} className={'btn btn-link'}>
              <FontAwesomeIcon icon={IconDefs.faInfoCircle} className={'me-2'} /> {t('Try_fullscreen_mode')} 😎
            </button>

            <button title={t('Close')} onClick={handleDismissInfo} className={'btn btn-link'}>
              <FontAwesomeIcon icon={IconDefs.faTimes} />
            </button>
          </div>
        )}
      </div>

      {experimentalFeaturesModal && <ExperimentalFeaturesModal visible={experimentalFeaturesModal} onClose={handleExperimentalFeaturesModalClosed} />}
    </>
  );
}
