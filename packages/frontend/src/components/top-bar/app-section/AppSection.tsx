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

const logger = Logger.get('AppSection.tsx');

export function AppSection() {
  const { t } = useTranslation('TopBar');
  const { modals } = useServices();
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
      </div>

      <div className={'ps-2'}>
        {!runningAsPwa && (
          <>
            {worksOffline && <div className={'mb-2'}>{t('You_can_use_abc-map_offline')}</div>}

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
