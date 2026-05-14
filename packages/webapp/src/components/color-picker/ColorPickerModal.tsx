/**
 * Copyright © 2026 Rémi Pace.
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
import type { ColorResult } from 'react-color';
import { SketchPicker } from 'react-color';
import React, { useCallback, useState } from 'react';
import type { RGBObject } from 'colortranslator';
import { ColorTranslator } from 'colortranslator';
import { useTranslation } from 'react-i18next';

interface Props {
  value?: string;
  onClose: (color: string) => void;
}

export function ColorPickerModal(props: Props) {
  const { onClose } = props;
  const { t } = useTranslation('ColorPicker');

  // We use a derived state because we want to call back with value only when modal closes
  const [value, setValue] = useState<RGBObject>(props.value ? ColorTranslator.toRGBAObject(props.value) : { R: 220, G: 220, B: 254, A: 0.9 });

  const handleChange = useCallback((color: ColorResult) => setValue({ R: color.rgb.r, G: color.rgb.g, B: color.rgb.b, A: color.rgb.a }), []);
  const handleClose = useCallback(() => onClose(ColorTranslator.toRGBA(value)), [onClose, value]);

  return (
    <Modal show={true} onHide={handleClose} centered>
      <Modal.Header closeButton>{t('Select_a_color')}</Modal.Header>
      <Modal.Body className={'d-flex justify-content-center'}>
        <SketchPicker disableAlpha={false} color={{ r: value.R, g: value.G, b: value.B, a: value.A }} onChange={handleChange} width={'100%'} />
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose} className={'btn btn-outline-secondary'} data-cy={'close-modal'} data-testid={'close-modal'}>
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
