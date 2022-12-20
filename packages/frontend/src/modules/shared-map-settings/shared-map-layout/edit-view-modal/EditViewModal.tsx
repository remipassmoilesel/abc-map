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

import { AbcSharedView } from '@abc-map/shared';
import { Modal } from 'react-bootstrap';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  view: AbcSharedView;
  onConfirm: (view: AbcSharedView) => void;
  onCancel: () => void;
}

function EditViewModal(props: Props) {
  const { view, onCancel, onConfirm } = props;
  const { t } = useTranslation('SharedMapSettingsModule');
  const [title, setTitle] = useState(view.title);
  const [confirmDisabled, setConfirmDisabled] = useState(true);

  const handleTitleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => setTitle(ev.target.value), []);
  const handleConfirm = useCallback(() => onConfirm({ ...view, title }), [onConfirm, title, view]);

  useEffect(() => setConfirmDisabled(view.title === title), [view.title, title]);

  return (
    <Modal show={true} onHide={onCancel} centered>
      <Modal.Header closeButton>{t('Edit_view')}</Modal.Header>
      <Modal.Body className={'d-flex justify-content-center'}>
        <input value={title} onChange={handleTitleChange} type={'text'} className={'form-control'} />
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onCancel} className={'btn btn-outline-secondary'}>
          {t('Cancel')}
        </button>
        <button onClick={handleConfirm} disabled={confirmDisabled} className={'btn btn-primary'}>
          {t('Confirm')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditViewModal;
