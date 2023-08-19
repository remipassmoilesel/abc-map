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

import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ModalEventType, ModalStatus, ShowEditPropertiesModal } from '../../core/ui/typings';
import { DataPropertiesMap } from '../../core/geo/features/FeatureWrapper';
import { PropertiesForm } from './PropertiesForm';
import { useTranslation } from 'react-i18next';
import { useServices } from '../../core/useServices';
import { Property } from './Property';
import { nanoid } from 'nanoid';
import { Logger } from '@abc-map/shared';
import { isValidDataField } from '../../core/geo/features/isValidDataField';
import { asNumberOrString, isValidNumber } from '../../core/utils/numbers';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';

export const logger = Logger.get('EditPropertiesModal.tsx');

export function EditPropertiesModal() {
  const { modals } = useServices();
  const { t } = useTranslation('EditPropertiesModal');
  const [visible, setVisible] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const handleOpen = useCallback((ev: ShowEditPropertiesModal) => {
    const properties: Property[] = [];
    for (const k in ev.properties) {
      const value = ev.properties[k];
      if (!isValidDataField(value)) {
        logger.warn('Unsupported type: ', typeof value);
        continue;
      }

      properties.push({ id: nanoid(), name: k, value: value });
    }

    if (!properties.length) {
      properties.push({ id: nanoid(), name: '', value: '' });
    }

    setProperties(properties);
    setVisible(true);
  }, []);

  const handleChange = useCallback((properties: Property[]) => {
    if (!properties.length) {
      setProperties([{ id: nanoid(), name: '', value: '' }]);
    } else {
      setProperties(properties);
    }
  }, []);

  const handleCancel = useCallback(() => {
    modals.dispatch({
      type: ModalEventType.FeaturePropertiesClosed,
      status: ModalStatus.Canceled,
      properties: {},
    });

    setVisible(false);
  }, [modals]);

  const handleConfirm = useCallback(() => {
    const result: DataPropertiesMap = {};
    for (const property of properties) {
      const name = property.name.trim();
      if (!name) {
        continue;
      }

      result[property.name.trim()] = normalizeValue(property.value);
    }

    modals.dispatch({
      type: ModalEventType.FeaturePropertiesClosed,
      status: ModalStatus.Confirmed,
      properties: result,
    });

    setVisible(false);
  }, [modals, properties]);

  useEffect(() => {
    modals.addListener(ModalEventType.ShowEditProperties, handleOpen);
    return () => modals.removeListener(ModalEventType.ShowEditProperties, handleOpen);
  }, [handleOpen, modals]);

  if (!visible || !properties) {
    return <div />;
  }

  return (
    <Modal show={visible} onHide={handleCancel} size={'lg'} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Properties')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={'d-flex flex-column'}>
        {/* Properties edition */}
        <PropertiesForm properties={properties} onChange={handleChange} />

        {/* Confirm and cancel buttons */}
        <div className={'d-flex justify-content-end'}>
          <button className={'btn btn-outline-secondary mr-2'} onClick={handleCancel} data-cy="properties-modal-cancel" data-testid="cancel">
            <FaIcon icon={IconDefs.faTimes} className={'me-2'} />
            {t('Cancel')}
          </button>
          <button className={'btn btn-primary'} onClick={handleConfirm} data-cy="properties-modal-confirm" data-testid="confirm">
            <FaIcon icon={IconDefs.faCheck} className={'me-2'} />
            {t('Save')}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function normalizeValue(property: string | number | boolean | undefined | null): string | number | boolean | undefined | null {
  if (isValidNumber(property)) {
    return asNumberOrString(property);
  }

  if (typeof property === 'string') {
    return property.trim();
  }

  return property;
}
