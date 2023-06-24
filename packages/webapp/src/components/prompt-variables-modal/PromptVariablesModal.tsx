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
import FormValidationLabel from '../form-validation-label/FormValidationLabel';
import React, { useCallback, useEffect, useState } from 'react';
import { useServices } from '../../core/useServices';
import { ModalEventType, ModalStatus, ShowPromptVariables } from '../../core/ui/typings';
import { PromptDefinition } from '../../core/ui/PromptDefinition';
import { PromptField } from './PromptField';
import { FormState } from '../form-validation-label/FormState';
import { VariableMap } from '../../core/utils/variableExpansion';
import { prefixedTranslation } from '../../i18n/i18n';
import { FoldingInfo } from '../folding-info/FoldingInfo';

const t = prefixedTranslation('PromptVariablesModal:');

function PromptVariablesModal() {
  const { modals } = useServices();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [definitions, setDefinitions] = useState<PromptDefinition[]>([]);
  const [value, setValue] = useState<VariableMap>({});
  const [formState, setFormState] = useState(FormState.FieldMissing);
  const submitDisabled = formState !== FormState.Ok;

  // Listen for events on mount
  useEffect(() => {
    const listener = (ev: ShowPromptVariables) => {
      setVisible(true);
      setTitle(ev.title);
      setMessage(ev.message);
      setDefinitions(ev.definitions);
    };

    modals.addListener<ShowPromptVariables>(ModalEventType.ShowPromptVariables, listener);
    return () => modals.removeListener(ModalEventType.ShowPromptVariables, listener);
  }, [modals]);

  // User cancel modal
  const handleCancel = useCallback(() => {
    modals.dispatch({ type: ModalEventType.PromptVariablesClosed, status: ModalStatus.Canceled, variables: {} });
    setVisible(false);
    setValue({});
  }, [modals]);

  // User confirm modal
  const handleConfirm = useCallback(() => {
    modals.dispatch({ type: ModalEventType.PromptVariablesClosed, status: ModalStatus.Confirmed, variables: value });
    setVisible(false);
    setValue({});
  }, [modals, value]);

  // User update field
  const handleFieldChange = useCallback(
    (value: VariableMap) => {
      setValue(value);
      const hasEmptyValue = definitions.map((def) => def.name).find((key) => !value[key]);
      setFormState(hasEmptyValue ? FormState.FieldMissing : FormState.Ok);
    },
    [definitions]
  );

  return (
    <Modal show={visible} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={'p-3'}>
          <div className={'mb-3'}>{message}</div>

          <FoldingInfo title={'🔒 ' + t('About_credential_storage')}>
            <div className={'mb-2'}>{t('Credentials_are_stored_in_your_project')}</div>
            <div>{t('If_your_project_is_public_then_your_credentials_are_public_too_This_can_lead_to_excessive_billing')}</div>
          </FoldingInfo>

          {definitions.map((def) => (
            <PromptField key={def.name} definition={def} value={value} onChange={handleFieldChange} />
          ))}

          <FormValidationLabel state={formState} className={'mb-3'} />

          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={handleCancel}>
              {t('Cancel')}
            </button>
            <button className={'btn btn-primary'} onClick={handleConfirm} disabled={submitDisabled}>
              {t('Confirm')}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default withTranslation()(PromptVariablesModal);
