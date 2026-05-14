/**
 * Copyright © 2026 Rémi Pace.
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

import { useTranslation, withTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import React, { useCallback } from 'react';
import type { ExperimentalFeature } from '../../../../experimental-features';
import { ExperimentalFeatures } from '../../../../experimental-features';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { FeatureToggle } from './FeatureToggle';
import { UiActions } from '../../../../store/ui/actions';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ExperimentalFeaturesModal = withTranslation()(function ExperimentalFeaturesModal(props: Props) {
  const { visible, onClose } = props;
  const featureStates = useAppSelector((st) => st.ui.experimentalFeatures);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('ExperimentalFeaturesModal');

  const handleChange = useCallback(
    (f: ExperimentalFeature, state: boolean) => {
      dispatch(UiActions.setExperimentalFeature(f.id, state));
    },
    [dispatch],
  );

  const handleClose = useCallback(() => {
    // We close modal
    onClose();
  }, [onClose]);

  return (
    <Modal show={visible} onHide={handleClose} centered>
      <Modal.Header closeButton>{t('Experimental_features')}</Modal.Header>
      <Modal.Body className={'d-flex flex-column justify-content-center'}>
        <div className={'mb-4'}>{t('Here_you_can_enable_features')}</div>
        {ExperimentalFeatures.map((feature) => {
          return (
            <FeatureToggle
              key={feature.id}
              feature={feature}
              state={featureStates[feature.id] ?? false}
              onChange={handleChange}
              data-cy={feature.id}
              disabled={!!feature.condition && !feature.condition()}
            />
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose} className={'btn btn-outline-secondary'} data-cy={'close-modal'}>
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
});
