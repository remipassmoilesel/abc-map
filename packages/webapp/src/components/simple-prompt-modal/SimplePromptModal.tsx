/**
 * Copyright © 2023 Rémi Pace.
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

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ModalEventType, ModalStatus, ShowSimplePrompt } from '../../core/ui/typings';
import { Logger } from '@abc-map/shared';
import { useServices } from '../../core/useServices';
import { useTranslation } from 'react-i18next';

const logger = Logger.get('SimplePromptModal.tsx');

export function SimplePromptModal() {
  const { modals } = useServices();
  const { t } = useTranslation('SimplePromptModal');

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [validationRegexp, setValidationRegexp] = useState<RegExp>(new RegExp('.+'));
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
  const [value, setValue] = useState('');
  const [isValueValid, setValueValid] = useState(false);

  useEffect(() => {
    const handleEvent = (ev: ShowSimplePrompt) => {
      setVisible(true);
      setTitle(ev.title);
      setMessage(ev.message);
      setValidationRegexp(ev.validationRegexp);
      setValidationErrorMessage(ev.validationErrorMessage);
      setValue(ev.value);
      setValueValid(!!ev.value.match(validationRegexp));
    };

    modals.addListener<ShowSimplePrompt>(ModalEventType.ShowSimplePrompt, handleEvent);
    return () => modals.removeListener(ModalEventType.ShowSimplePrompt, handleEvent);
  }, [modals, validationRegexp]);

  const handleCancel = useCallback(() => {
    setVisible(false);
    modals.dispatch({ type: ModalEventType.SimplePromptClosed, status: ModalStatus.Canceled, value });
  }, [modals, value]);

  const handleConfirm = useCallback(() => {
    setVisible(false);
    modals.dispatch({ type: ModalEventType.SimplePromptClosed, status: ModalStatus.Confirmed, value });
  }, [modals, value]);

  const handleInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setValue(ev.target.value);
      setValueValid(!!ev.target.value.match(validationRegexp));
    },
    [validationRegexp]
  );

  return (
    <Modal show={visible} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={'p-3'}>
          <div className={'mb-3'}>{message}</div>

          <div className={'mb-3'}>
            <input type={'text'} value={value} onChange={handleInputChange} data-cy="prompt-input" data-testid="prompt-input" className={'form-control'} />
          </div>

          <div className={'mb-3'}>{!isValueValid && validationErrorMessage} &nbsp;</div>

          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={handleCancel} data-cy="prompt-cancel" data-testid={'prompt-cancel'}>
              {t('Cancel')}
            </button>
            <button className={'btn btn-primary'} onClick={handleConfirm} disabled={!isValueValid} data-cy="prompt-confirm" data-testid={'prompt-confirm'}>
              {t('Confirm')}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
