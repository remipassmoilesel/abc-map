import { Modal } from 'react-bootstrap';
import TextFeedbackForm from './form/TextFeedbackForm';
import React, { useCallback, useEffect, useState } from 'react';
import { useServices } from '../../core/hooks';
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
