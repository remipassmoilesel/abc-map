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

import { useCallback } from 'react';
import { CustomEditor } from '../../CustomEditor';
import { useEditor } from '../../useEditor';
import { IconDefs } from '../../../icon/IconDefs';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { Action } from '../../../button-menu/Action';
import { ButtonMenu } from '../../../button-menu/ButtonMenu';
import { Separator } from '../../../button-menu/Separator';

const t = prefixedTranslation('TextEditor:');

interface Props {
  className?: string;
}

export function TableControls(props: Props) {
  const { className } = props;
  const { editor } = useEditor();

  const handleCreateTable = useCallback(() => CustomEditor.table.createTable(editor), [editor]);
  const handleRemoveTable = useCallback(() => CustomEditor.table.removeTable(editor), [editor]);

  const handleAddRow = useCallback(() => CustomEditor.table.addRow(editor), [editor]);
  const handleRemoveRow = useCallback(() => CustomEditor.table.removeRow(editor), [editor]);

  const handleAddCol = useCallback(() => CustomEditor.table.addCol(editor), [editor]);
  const handleRemoveCol = useCallback(() => CustomEditor.table.removeCol(editor), [editor]);

  const handleSetBorders = useCallback((size: number) => CustomEditor.table.setBorders(editor, size), [editor]);

  return (
    <ButtonMenu label={t('Tables')} icon={IconDefs.faTable} className={className}>
      <Action label={t('Create_a_table')} onClick={handleCreateTable} icon={IconDefs.faPlus} />
      <Action label={t('Remove_a_table')} onClick={handleRemoveTable} />

      <Separator />

      <Action label={t('Add_a_row')} onClick={handleAddRow} icon={IconDefs.faPlus} />
      <Action label={t('Remove_a_row')} onClick={handleRemoveRow} />

      <Separator />

      <Action label={t('Add_a_column')} onClick={handleAddCol} icon={IconDefs.faPlus} />
      <Action label={t('Remove_a_column')} onClick={handleRemoveCol} />

      <Separator />

      <Action label={t('No_borders')} onClick={() => handleSetBorders(0)} icon={IconDefs.faBorderNone} />
      {[1, 2, 3].map((size) => (
        <Action key={size} label={t('Borders_size_X') + size} onClick={() => handleSetBorders(size)} />
      ))}
    </ButtonMenu>
  );
}
