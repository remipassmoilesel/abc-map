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

import { Modal } from 'react-bootstrap';
import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../core/store/hooks';
import { UiActions } from '../../../../core/store/ui/actions';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';

const t = prefixedTranslation('ShareSettingsView:');

/* TODO: delete when development done */
export function InformationModal() {
  const dispatch = useAppDispatch();
  const acknowledged = useAppSelector((st) => st.ui.informations.sharedMapAlpha);

  const onClose = useCallback(() => dispatch(UiActions.ackSharedMapInformation()), [dispatch]);

  return (
    <>
      {!acknowledged && (
        <Modal show={true} onHide={onClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('Work_in_progress')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={'d-flex justify-content-center mb-4'}>
              <FaIcon icon={IconDefs.faFileCode} size={'3rem'} />
            </div>

            <div className={'text-center mb-2'}>{t('This_feature_is_under_development')}</div>
            <div className={'text-center mb-2'}>{t('It_certainly_lacks_options')}</div>

            <div className={'d-flex justify-content-end mt-4'}>
              <button onClick={onClose} className={'btn btn-outline-secondary'} data-cy={'close-information-modal'}>
                {t('Close')}
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
