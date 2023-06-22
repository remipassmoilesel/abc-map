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
import { ColorResult, SketchPicker } from 'react-color';
import React, { useCallback, useEffect, useState } from 'react';
import { prefixedTranslation } from '../../i18n/i18n';
import { ColorTranslator, RGBObject } from 'colortranslator';
const { toRGBA } = ColorTranslator;

interface Props {
  value?: string;
  onClose: (color: string) => void;
}

const t = prefixedTranslation('ColorPicker:');

function ColorPickerModal(props: Props) {
  const { onClose } = props;

  // We use a derived state because we want to call back with value only when modal closes
  const [value, setValue] = useState<RGBObject>({ r: 220, g: 220, b: 254, a: 0.9 });
  useEffect(() => {
    props.value && setValue(toRGBA(props.value, false));
  }, [props.value]);

  const handleChange = useCallback((color: ColorResult) => setValue(color.rgb), []);
  const handleClose = useCallback(() => onClose(toRGBA(value)), [onClose, value]);

  return (
    <Modal show={true} onHide={handleClose} centered>
      <Modal.Header closeButton>{t('Select_a_color')}</Modal.Header>
      <Modal.Body className={'d-flex justify-content-center'}>
        <SketchPicker disableAlpha={false} color={value} onChange={handleChange} width={'100%'} />
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose} className={'btn btn-outline-secondary'} data-cy={'close-modal'} data-testid={'close-modal'}>
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default withTranslation()(ColorPickerModal);
