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
import TextFeedbackForm from './form/TextFeedbackForm';
import React, { useCallback, useEffect, useState } from 'react';
import { useServices } from '../../core/useServices';
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('FeedbackModal:');

function FeedbackModal() {
  const { modals } = useServices();
  const [modalVisible, showModal] = useState(false);

  const handleShow = useCallback(() => showModal(true), []);

  const handleCancel = useCallback(() => {
    showModal(false);
    modals.dispatch({ type: ModalEventType.TextFeedbackClosed, status: ModalStatus.Canceled });
  }, [modals]);

  const handleConfirm = useCallback(() => {
    showModal(false);
    modals.dispatch({ type: ModalEventType.TextFeedbackClosed, status: ModalStatus.Confirmed });
  }, [modals]);

  useEffect(() => {
    modals.addListener(ModalEventType.ShowTextFeedback, handleShow);
    return () => modals.removeListener(ModalEventType.ShowTextFeedback, handleShow);
  }, [handleShow, modals]);

  return (
    <Modal show={modalVisible} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('So_how_is_it_going')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TextFeedbackForm onDone={handleConfirm} onCancel={handleCancel} />
      </Modal.Body>
    </Modal>
  );
}

export default FeedbackModal;
