import React, { ChangeEvent, useCallback, useState } from 'react';
import Cls from './TextFeedbackForm.module.scss';
import { useServices } from '../../../core/hooks';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../../i18n/i18n';

const logger = Logger.get('TextFeedbackForm.tsx');

const t = prefixedTranslation('TextFeedbackForm:');

interface Props {
  onDone: () => void;
  onCancel: () => void;
  className?: string;
}

function TextFeedbackForm(props: Props) {
  const { feedback, toasts } = useServices();
  const { onDone, onCancel, className } = props;
  const [feedbackValue, setFeedbackValue] = useState('');

  const handleFeedbackChange = useCallback((ev: ChangeEvent<HTMLTextAreaElement>) => setFeedbackValue(ev.target.value), []);

  const handleConfirm = useCallback(() => {
    if (!feedbackValue || feedbackValue.length < 15) {
      toasts.info(t('You_must_enter_at_least_15_chars'));
      return;
    }

    feedback
      .textFeedback(feedbackValue)
      .then(() => toasts.info(`${t('Thank_you')} 👌`))
      .catch((err) => logger.error('Feedback error: ', err))
      .finally(() => onDone());
  }, [feedback, feedbackValue, onDone, toasts]);

  return (
    <div className={`w-100 ${className || ''}`}>
      <div className={'mb-2'}>{t('Contextualize_comments')}</div>
      <div className={'mb-2'}>{t('If_you_want_a_response_add_email')}</div>
      <textarea value={feedbackValue} onInput={handleFeedbackChange} className={`form-control ${Cls.textarea}`} />
      <div className={'mt-4 d-flex justify-content-end'}>
        <button onClick={onCancel} className={'btn btn-outline-secondary mr-2'} data-cy={'confirmation-cancel'}>
          {t('Cancel')}
        </button>
        <button onClick={handleConfirm} className={'btn btn-primary'} data-cy={'confirmation-confirm'}>
          {t('Send')}
        </button>
      </div>
    </div>
  );
}

export default TextFeedbackForm;
