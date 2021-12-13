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

import React, { useCallback, useEffect, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { Modal } from 'react-bootstrap';
import { ColorTranslator, RGBObject } from 'colortranslator';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './ColorPicker.module.scss';

const { toRGBA } = ColorTranslator;

interface Props {
  value: string;
  onClose: (value: string) => void;
  'data-cy'?: string;
}

const t = prefixedTranslation('ColorSelector:');

function ColorPicker(props: Props) {
  const onClose = props.onClose;
  const dataCy = props['data-cy'];

  const [modal, displayModal] = useState(false);

  // We use a derived state because we want to call back with value only when modal closes
  const [value, setValue] = useState<RGBObject>({ r: 220, g: 220, b: 254, a: 0.9 });
  useEffect(() => {
    props.value && setValue(toRGBA(props.value, false));
  }, [props.value]);

  const handleChange = useCallback((color: ColorResult) => setValue(color.rgb), []);
  const handleOpenModal = useCallback(() => displayModal(true), []);
  const handleCloseModal = useCallback(() => {
    displayModal(false);
    onClose(toRGBA(value));
  }, [onClose, value]);

  return (
    <>
      {/* Button, always visible */}
      <button onClick={handleOpenModal} className={Cls.button} type={'button'} style={{ backgroundColor: toRGBA(value) }} data-cy={dataCy} />

      {/* Modal, visible on demand */}
      <Modal show={modal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>{t('Select_a_color')}</Modal.Header>
        <Modal.Body className={'d-flex justify-content-center'}>
          <SketchPicker disableAlpha={false} color={value} onChange={handleChange} width={'100%'} />
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleCloseModal} className={'btn btn-outline-secondary'} data-cy={'close-modal'} data-testid={'close-modal'}>
            {t('Close')}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default withTranslation()(ColorPicker);
