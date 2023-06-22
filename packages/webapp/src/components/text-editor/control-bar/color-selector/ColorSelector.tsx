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

import Cls from './ColorSelector.module.scss';
import { useCallback, useState } from 'react';
import { CustomEditor } from '../../CustomEditor';
import { useEditor } from '../../useEditor';
import { BaseSelection, Transforms } from 'slate';
import { FaIcon } from '../../../icon/FaIcon';
import { IconDefs } from '../../../icon/IconDefs';
import ColorPickerButton from '../../../color-picker/ColorPickerButton';
import clsx from 'clsx';
import { WithTooltip } from '../../../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../../../i18n/i18n';

const t = prefixedTranslation('TextEditor:');

interface Props {
  className?: string;
}

export function ColorSelector(props: Props) {
  const { className } = props;
  const { editor } = useEditor();

  // We need to keep the selection while the user selects a color, otherwise it will be lost on focus change
  const [selection, setSelection] = useState<BaseSelection>(null);
  const handleOpen = useCallback(() => setSelection(editor.selection), [editor.selection]);

  // We must use colors with full opacity otherwise UX will be misleading
  const [fgColor, setFgColor] = useState('#000000FF');
  const [bgColor, setBgColor] = useState('#FFFFFFFF');

  const handleFgColorPickerClosed = useCallback(
    (color: string) => {
      setFgColor(color);

      if (selection) {
        Transforms.setSelection(editor, selection);
      }
      CustomEditor.foregroundColor.set(editor, color);
    },
    [editor, selection]
  );

  const handleBgColorPickerClosed = useCallback(
    (color: string) => {
      setBgColor(color);

      if (selection) {
        Transforms.setSelection(editor, selection);
      }
      CustomEditor.backgroundColor.set(editor, color);
    },
    [editor, selection]
  );

  return (
    <div className={clsx(Cls.container, className)}>
      {/* Foreground color */}
      <WithTooltip title={t('Foreground_color')}>
        <div className={Cls.part}>
          <FaIcon icon={IconDefs.faFont} className={'mr-2'} />
          <ColorPickerButton value={fgColor} onOpen={handleOpen} onClose={handleFgColorPickerClosed} className={'mr-4'} />
        </div>
      </WithTooltip>

      {/* Background color */}
      <WithTooltip title={t('Background_color')}>
        <div className={Cls.part}>
          <FaIcon icon={IconDefs.faHighlighter} className={'mr-2'} />
          <ColorPickerButton value={bgColor} onOpen={handleOpen} onClose={handleBgColorPickerClosed} />
        </div>
      </WithTooltip>
    </div>
  );
}
