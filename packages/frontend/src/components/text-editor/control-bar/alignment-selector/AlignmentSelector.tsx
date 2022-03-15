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

import { useCallback } from 'react';
import { CustomEditor } from '../../CustomEditor';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useEditor } from '../../useEditor';
import { ButtonMenu } from '../../../button-menu/ButtonMenu';
import { IconDefs } from '../../../icon/IconDefs';
import { Action } from '../../../button-menu/Action';

const t = prefixedTranslation('TextEditor:');

interface Props {
  className?: string;
}

export function AlignmentSelector(props: Props) {
  const { className } = props;
  const { editor } = useEditor();

  const handleSetLeft = useCallback(() => CustomEditor.align.set(editor, 'left'), [editor]);
  const handleSetCenter = useCallback(() => CustomEditor.align.set(editor, 'center'), [editor]);
  const handleSetRight = useCallback(() => CustomEditor.align.set(editor, 'right'), [editor]);
  const handleSetJustify = useCallback(() => CustomEditor.align.set(editor, 'justify'), [editor]);

  return (
    <ButtonMenu label={t('Alignment')} icon={IconDefs.faAlignLeft} className={className}>
      <Action label={t('Alignment_left')} icon={IconDefs.faAlignLeft} onClick={handleSetLeft} />
      <Action label={t('Alignment_center')} icon={IconDefs.faAlignCenter} onClick={handleSetCenter} />
      <Action label={t('Alignment_right')} icon={IconDefs.faAlignRight} onClick={handleSetRight} />
      <Action label={t('Alignment_justify')} icon={IconDefs.faAlignJustify} onClick={handleSetJustify} />
    </ButtonMenu>
  );
}
