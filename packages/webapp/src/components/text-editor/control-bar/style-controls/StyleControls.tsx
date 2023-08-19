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

import Cls from './StyleControls.module.scss';
import { MouseEvent, useCallback } from 'react';
import { CustomEditor } from '../../CustomEditor';
import { FaIcon } from '../../../icon/FaIcon';
import { IconDefs } from '../../../icon/IconDefs';
import { WithTooltip } from '../../../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useEditor } from '../../useEditor';
import clsx from 'clsx';
import { ButtonMenu } from '../../../button-menu/ButtonMenu';
import { Action } from '../../../button-menu/Action';

const t = prefixedTranslation('TextEditor:');

interface Props {
  className?: string;
}

export function StyleControls(props: Props) {
  const { className } = props;
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

  const handleSetSize = useCallback(
    (event: MouseEvent, size: number) => {
      event.preventDefault();
      CustomEditor.size.set(editor, size);
    },
    [editor]
  );

  return (
    <div className={clsx(Cls.container, className)}>
      {/* Bold */}
      <WithTooltip title={t('Bold')} placement={'bottom'}>
        <button onClick={handleToggleBold} data-cy={'bold'}>
          <FaIcon icon={IconDefs.faBold} />
        </button>
      </WithTooltip>

      {/* Italic */}
      <WithTooltip title={t('Italic')} placement={'bottom'}>
        <button onClick={handleToggleItalic} data-cy={'italic'}>
          <FaIcon icon={IconDefs.faItalic} />
        </button>
      </WithTooltip>

      {/* Underline */}
      <WithTooltip title={t('Underline')} placement={'bottom'}>
        <button onClick={handleToggleUnderline} data-cy={'underline'}>
          <FaIcon icon={IconDefs.faUnderline} />
        </button>
      </WithTooltip>

      {/* Size */}
      <ButtonMenu label={t('Font_size')} icon={IconDefs.faTextHeight} closeOnClick={true}>
        <Action label={t('Normal_size')} onClick={(ev) => handleSetSize(ev, 1)} />
        <Action label={`${t('Size_X')} 2`} onClick={(ev) => handleSetSize(ev, 2)} />
        <Action label={`${t('Size_X')} 3`} onClick={(ev) => handleSetSize(ev, 3)} />
        <Action label={`${t('Size_X')} 4`} onClick={(ev) => handleSetSize(ev, 4)} />
      </ButtonMenu>

      {/* Clear style */}
      <WithTooltip title={t('Clear_style')} placement={'bottom'}>
        <button onClick={handleClearStyle}>
          <FaIcon icon={IconDefs.faEraser} />
        </button>
      </WithTooltip>
    </div>
  );
}
