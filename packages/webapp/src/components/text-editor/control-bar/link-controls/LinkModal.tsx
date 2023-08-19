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

import { Modal } from 'react-bootstrap';
import FormValidationLabel from '../../../form-validation-label/FormValidationLabel';
import { FormState } from '../../../form-validation-label/FormState';
import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { ValidationHelper } from '../../../../core/utils/ValidationHelper';

const t = prefixedTranslation('TextEditor:');

interface Props {
  initialText: string;
  initialUrl: string;
  onCancel: () => void;
  onConfirm: (text: string, url: string) => void;
}

export function LinkModal(props: Props) {
  const { initialText, initialUrl, onCancel, onConfirm } = props;
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl || '');
  const [formState, setFormState] = useState(FormState.InvalidLinkText);

  // We must stop propagation in order to not lost focus, due to editor event handler
  const handleClick = useCallback((ev: MouseEvent) => ev.stopPropagation(), []);

  const validateLink = useCallback((text: string, url: string) => {
    if (!text) {
      setFormState(FormState.InvalidLinkText);
      return;
    }
    if (!ValidationHelper.url(url)) {
      setFormState(FormState.InvalidUrl);
      return;
    }

    setFormState(FormState.Ok);
  }, []);

  const handleTextChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      setText(value);
      validateLink(value, url);
      setFormState(value ? FormState.Ok : FormState.FieldMissing);
    },
    [url, validateLink]
  );

  const handleUrlChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      setUrl(value);
      validateLink(text, value);
    },
    [text, validateLink]
  );

  // Validate on mount
  useEffect(() => validateLink(text, url), [text, url, validateLink]);

  const handleConfirm = useCallback(() => onConfirm(text, url), [onConfirm, text, url]);

  return (
    <Modal show={true} onHide={onCancel} centered>
      <Modal.Header closeButton>{t('Link')} 🔗</Modal.Header>
      <Modal.Body className={'d-flex flex-column'} onClick={handleClick}>
        {/* Link label */}
        <div className={'mr-2'}>{t('Label')}</div>
        <input type={'text'} value={text} onChange={handleTextChange} className={'form-control mb-3'} />

        {/* Link URL */}
        <div className={'mr-2'}>{t('URL')}</div>
        <input type={'text'} value={url} onChange={handleUrlChange} className={'form-control mb-3'} />

        {/* Validation message */}
        <FormValidationLabel state={formState} className={'my-3'} />
      </Modal.Body>

      {/* Confirm and cancel controls */}
      <Modal.Footer>
        <button onClick={onCancel} className={'btn btn-outline-secondary'}>
          {t('Cancel')}
        </button>
        <button onClick={handleConfirm} disabled={formState !== FormState.Ok} className={'btn btn-primary'}>
          {t('Confirm')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
