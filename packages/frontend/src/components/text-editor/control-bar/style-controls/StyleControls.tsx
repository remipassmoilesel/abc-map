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

import Cls from './StyleControls.module.scss';
import { MouseEvent, useCallback } from 'react';
import { CustomEditor } from '../../CustomEditor';
import { FaIcon } from '../../../icon/FaIcon';
import { IconDefs } from '../../../icon/IconDefs';
import { WithTooltip } from '../../../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useEditor } from '../../useEditor';

const t = prefixedTranslation('TextEditor:');

export function StyleControls() {
  const { editor } = useEditor();

  const handleClearStyle = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      CustomEditor.clearStyle(editor);
    },
    [editor]
  );

  const handleToggleBold = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      CustomEditor.bold.toggle(editor);
    },
    [editor]
  );

  const handleToggleItalic = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      CustomEditor.italic.toggle(editor);
    },
    [editor]
  );

  const handleToggleUnderline = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      CustomEditor.underline.toggle(editor);
    },
    [editor]
  );

  return (
    <div className={Cls.container}>
      {/* Bold */}
      <WithTooltip title={t('Bold')} placement={'bottom'}>
        <button onClick={handleToggleBold}>
          <FaIcon icon={IconDefs.faBold} />
        </button>
      </WithTooltip>

      {/* Italic */}
      <WithTooltip title={t('Italic')} placement={'bottom'}>
        <button onClick={handleToggleItalic}>
          <FaIcon icon={IconDefs.faItalic} />
        </button>
      </WithTooltip>

      {/* Underline */}
      <WithTooltip title={t('Underline')} placement={'bottom'}>
        <button onClick={handleToggleUnderline}>
          <FaIcon icon={IconDefs.faUnderline} />
        </button>
      </WithTooltip>

      {/* Clear style */}
      <WithTooltip title={t('Clear_style')} placement={'bottom'}>
        <button onClick={handleClearStyle}>
          <FaIcon icon={IconDefs.faEraser} />
        </button>
      </WithTooltip>
    </div>
  );
}
