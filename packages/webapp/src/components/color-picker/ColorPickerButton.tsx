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

import React, { useCallback, useState } from 'react';
import { withTranslation } from 'react-i18next';
import Cls from './ColorPicker.module.scss';
import ColorPickerModal from './ColorPickerModal';
import clsx from 'clsx';

interface Props {
  value: string;
  onClose: (value: string) => void;
  'data-cy'?: string;
  onOpen?: () => void;
  className?: string;
}

function ColorPickerButton(props: Props) {
  const { value, onClose, onOpen, className, 'data-cy': dataCy } = props;
  const [modalVisible, displayModal] = useState(false);

  const handleOpen = useCallback(() => {
    displayModal(true);
    onOpen && onOpen();
  }, [onOpen]);

  const handleClose = useCallback(
    (color: string) => {
      displayModal(false);
      onClose(color);
    },
    [onClose]
  );

  return (
    <>
      {/* Button, always visible */}
      <button type={'button'} onClick={handleOpen} className={clsx(Cls.button, className)} style={{ backgroundColor: value }} data-cy={dataCy} />

      {/* Picker, visible on click */}
      {modalVisible && <ColorPickerModal value={value} onClose={handleClose} />}
    </>
  );
}

export default withTranslation()(ColorPickerButton);
