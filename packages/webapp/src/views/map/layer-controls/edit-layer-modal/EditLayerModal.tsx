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

import Cls from './EditLayerModal.module.scss';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';
import { LayerWrapper } from '../../../../core/geo/layers/LayerWrapper';
import { Logger } from '@abc-map/shared';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { EditLayerChangeset } from '../../../../core/history/changesets/layers/EditLayerChangeset';
import { useTranslation } from 'react-i18next';
import { AttributionFormat } from '../../../../core/geo/AttributionFormat';
import { useServices } from '../../../../core/useServices';
import { LabeledLayerTypes } from '../add-layer-modal/_common/LabeledLayerTypes';

const logger = Logger.get('EditLayerModal.tsx');

interface Props {
  layer: LayerWrapper;
  onHide: () => void;
}

export function EditLayerModal(props: Props) {
  const { onHide, layer } = props;
  const { t } = useTranslation('MapView');
  const { history } = useServices();

  const [nameInput, setNameInput] = useState('');
  const [opacityInput, setOpacityInput] = useState(1);
  const [attributionsInput, setAttributionsInput] = useState('');

  useEffect(() => {
    setNameInput(layer.getName() ?? '');
    setOpacityInput(layer.getOpacity());
    setAttributionsInput(layer.getAttributions(AttributionFormat.HTML)?.join('\r\n') || '');
  }, [layer]);

  const handleNameChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setNameInput(ev.target.value);
  }, []);

  const handleOpacityChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setOpacityInput(parseFloat(ev.target.value));
  }, []);

  const handleAttributionsChange = useCallback((ev: ChangeEvent<HTMLTextAreaElement>) => {
    setAttributionsInput(ev.target.value);
  }, []);

  const handleConfirm = useCallback(() => {
    const change = async () => {
      const before = { name: layer.getName() || '', opacity: layer.getOpacity(), attributions: layer.getAttributions(AttributionFormat.HTML)?.slice() || [] };
      const after = { name: nameInput, opacity: opacityInput, attributions: attributionsInput.split(/\r?\n/) };

      if (!isEqual(before, after)) {
        const cs = EditLayerChangeset.create(layer, before, after);
        await cs.execute();
        history.register(HistoryKey.Map, cs);
      }

      onHide();
    };

    change().catch((err) => logger.error('Cannot update layer', err));
  }, [attributionsInput, history, layer, nameInput, onHide, opacityInput]);

  return (
    <Modal show={true} onHide={onHide} size={'lg'} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('Edit_layer')} {layer.getName()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={`p-3`}>
          {/* Type of layer */}
          <div className={'mb-2'}>{t('Layer_type')}:</div>
          <input
            type={'text'}
            value={t(LabeledLayerTypes.find(layer.getType() ?? '')?.i18nLabel ?? '<unsupported-type>')}
            readOnly={true}
            disabled={true}
            className={'form-control mb-4'}
          />

          {/* Name of layer */}
          <div className={'mb-2'}>{t('Name_of_layer')}:</div>
          <input
            type={'text'}
            value={nameInput}
            onChange={handleNameChange}
            className={'form-control mb-4'}
            data-testid={'name-input'}
            data-cy={'name-input'}
          />

          {/* Opacity */}
          <div className={'mb-2'}>{t('Opacity')}:</div>
          <div className={'d-flex align-items-center mb-4'}>
            <input
              type="range"
              value={opacityInput}
              onChange={handleOpacityChange}
              min="0"
              max="1"
              step={'0.1'}
              className={Cls.opacitySlider}
              data-testid={'opacity-input'}
            />
            <div className={'ml-2'}>{opacityInput} / 1</div>
          </div>

          {/* Additional attributions */}
          <div className={'my-2'}>Attributions:</div>
          <textarea value={attributionsInput} onChange={handleAttributionsChange} rows={3} className={'form-control mb-4'} data-testid={'attributions-input'} />

          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={onHide} data-testid={'cancel-button'}>
              {t('Cancel')}
            </button>
            <button onClick={handleConfirm} className={'btn btn-primary'} data-testid={'submit-button'} data-cy={'submit-button'}>
              {t('Confirm')}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
