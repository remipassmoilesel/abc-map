/**
 * Copyright © 2022 Rémi Pace.
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

import { Row } from '@tanstack/react-table';
import { DataRow } from '../../../../core/data/data-source/DataSource';
import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';

interface Props {
  row: Row<DataRow>;
  onSelect: (r: DataRow) => void;
  onEdit: (r: DataRow) => void;
  onDelete: (r: DataRow) => void;
  onShowOnMap: (r: DataRow) => void;
}

export function RowActions(props: Props) {
  const { row, onSelect, onEdit, onDelete, onShowOnMap } = props;
  const { t } = useTranslation('DataTableModule');

  const handleSelect = useCallback(() => onSelect(row.original), [onSelect, row.original]);
  const handleEdit = useCallback(() => onEdit(row.original), [onEdit, row.original]);
  const handleDelete = useCallback(() => onDelete(row.original), [onDelete, row.original]);
  const handleShowOnMap = useCallback(() => onShowOnMap(row.original), [onShowOnMap, row]);

  const selected = row.original.metadata.selected;

  return (
    <>
      <button onClick={handleShowOnMap} title={t('Show_on_map')} className={'btn btn-sm btn-link'}>
        <FaIcon icon={IconDefs.faMagnifyingGlass} />
      </button>
      <button onClick={handleSelect} title={selected ? t('Deselect') : t('Select')} className={'btn btn-sm btn-link'}>
        {selected ? <FaIcon icon={IconDefs.faMinus} /> : <FaIcon icon={IconDefs.faPlus} />}
      </button>
      <button onClick={handleEdit} title={t('Edit')} className={'btn btn-sm btn-link'}>
        <FaIcon icon={IconDefs.faPen} />
      </button>
      <button onClick={handleDelete} title={t('Delete')} className={'btn btn-sm btn-link'}>
        <FaIcon icon={IconDefs.faTrash} />
      </button>
    </>
  );
}
