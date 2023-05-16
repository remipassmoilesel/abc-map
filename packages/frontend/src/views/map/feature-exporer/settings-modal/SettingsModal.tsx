/**
 * Copyright © 2022 Rémi Pace.
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
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Settings } from '../Settings';

interface Props {
  value: Settings;
  nameFieldCandidate: string[];
  onConfirm: (settings: Settings) => void;
  onCancel: () => void;
}

export function SettingsModal(props: Props) {
  const { value, nameFieldCandidate, onConfirm, onCancel } = props;
  const { t } = useTranslation('MapView');
  const [nameField, setNameField] = useState(value.nameField);

  const handleConfirm = useCallback(() => onConfirm({ ...value, nameField }), [nameField, onConfirm, value]);

  return (
    <Modal show={true} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Settings')}️</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={'mb-2'}>{t('Name_field')}</div>
        <div>
          {nameFieldCandidate.map((candidate, i) => {
            const handleSelect = () => setNameField(candidate);
            return (
              <div
                key={`${candidate}_${i}`}
                onClick={handleSelect}
                className={'cursor-pointer d-flex align-items-center'}
                data-testid={`candidate-${candidate}`}
              >
                <input key={candidate} type={'radio'} name={'name-field-name'} onChange={handleSelect} checked={candidate === nameField} className={'mx-2'} />
                {candidate}
              </div>
            );
          })}
        </div>

        <div className={'d-flex justify-content-end'}>
          <button className={'btn btn-secondary mr-3'} onClick={onCancel}>
            {t('Cancel')}
          </button>
          <button onClick={handleConfirm} className={'btn btn-primary'} data-testid={'confirm'}>
            {t('Confirm')}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
