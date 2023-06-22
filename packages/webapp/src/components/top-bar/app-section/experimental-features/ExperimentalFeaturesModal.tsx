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

import { withTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import React, { useCallback } from 'react';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { DevServiceWorker, ExperimentalFeature, ExperimentalFeatures } from '../../../../experimental-features';
import { useAppDispatch, useAppSelector } from '../../../../core/store/hooks';
import FeatureToggle from './FeatureToggle';
import { UiActions } from '../../../../core/store/ui/actions';
import { useServices } from '../../../../core/useServices';
import { useModuleRegistry } from '../../../../core/modules/hooks';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const t = prefixedTranslation('ExperimentalFeaturesModal:');

function ExperimentalFeaturesModal(props: Props) {
  const { visible, onClose } = props;
  const { pwa } = useServices();
  const featureStates = useAppSelector((st) => st.ui.experimentalFeatures);
  const dispatch = useAppDispatch();
  const registry = useModuleRegistry();

  const handleChange = useCallback(
    (f: ExperimentalFeature, state: boolean) => {
      if (DevServiceWorker.id === f.id) {
        if (!state) {
          alert('You will have to reload twice to get rid of service worker');
        }
        pwa.setDevWorkerEnabled(state);
      }

      dispatch(UiActions.setExperimentalFeature(f.id, state));
    },
    [dispatch, pwa]
  );

  const handleClose = useCallback(() => {
    // We reset data processing modules, in case some have been enabled/disabled
    registry.resetModules();

    // We close modal
    onClose();
  }, [onClose, registry]);

  return (
    <Modal show={visible} onHide={handleClose} centered>
      <Modal.Header closeButton>{t('Experimental_features')}</Modal.Header>
      <Modal.Body className={'d-flex flex-column justify-content-center'}>
        <div className={'mb-4'}>{t('Here_you_can_enable_features')}</div>
        {ExperimentalFeatures.filter((f) => !f.condition || f.condition()).map((feature) => (
          <FeatureToggle key={feature.id} feature={feature} state={featureStates[feature.id] ?? false} onChange={handleChange} data-cy={feature.id} />
        ))}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose} className={'btn btn-outline-secondary'} data-cy={'close-modal'}>
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default withTranslation()(ExperimentalFeaturesModal);
