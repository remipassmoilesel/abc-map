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

import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';
import { useServices } from '../../core/useServices';
import { ModalEvent, ModalEventType } from '../../core/ui/typings';

export function WarningModal() {
  const { t } = useTranslation('WarningModal');
  const { modals } = useServices();

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const listener = (ev: ModalEvent) => {
      if (ModalEventType.ShowWarning === ev.type) {
        setTitle(ev.title);
        setMessage(ev.message);
        setVisible(true);
      }
    };

    modals.addListener(ModalEventType.ShowWarning, listener);
    return () => modals.removeListener(ModalEventType.ShowWarning, listener);
  }, [modals]);

  const handleClose = useCallback(() => {
    modals.dispatch({ type: ModalEventType.WarningClosed });
    setTitle('');
    setMessage('');
    setVisible(false);
  }, [modals]);

  if (!visible) {
    return <></>;
  }

  return (
    <Modal show={visible} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div dangerouslySetInnerHTML={{ __html: title }}></div>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: message }} />
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose} className={'btn btn-outline-secondary'} data-cy={'close-modal'} data-testid={'close-modal'}>
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
