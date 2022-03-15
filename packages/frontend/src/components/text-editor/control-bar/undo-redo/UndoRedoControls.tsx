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

import Cls from './UndoRedoControls.module.scss';
import { useCallback } from 'react';
import { HistoryEditor } from 'slate-history';
import { useEditor } from '../../useEditor';
import { WithTooltip } from '../../../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { FaIcon } from '../../../icon/FaIcon';
import { IconDefs } from '../../../icon/IconDefs';
import clsx from 'clsx';

const t = prefixedTranslation('TextEditor:');

interface Props {
  className?: string;
}

export function UndoRedoControls(props: Props) {
  const { className } = props;
  const { editor } = useEditor();
  const handleUndo = useCallback(() => HistoryEditor.undo(editor), [editor]);
  const handleRedo = useCallback(() => HistoryEditor.redo(editor), [editor]);

  return (
    <div className={clsx(Cls.container, className)}>
      {/* Undo */}
      <WithTooltip title={t('Undo')}>
        <button onClick={handleUndo}>
          <FaIcon icon={IconDefs.faUndo} />
        </button>
      </WithTooltip>

      {/* Redo */}
      <WithTooltip title={t('Redo')}>
        <button onClick={handleRedo}>
          <FaIcon icon={IconDefs.faRedo} />
        </button>
      </WithTooltip>
    </div>
  );
}
