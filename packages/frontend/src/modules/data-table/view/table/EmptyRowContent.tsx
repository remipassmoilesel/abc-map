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

import React, { useCallback } from 'react';
import { DataRow } from '../../../../core/data/data-source/DataSource';
import { useTranslation } from 'react-i18next';
import { getRemSize } from '../../../../core/ui/getRemSize';

interface Props {
  row: DataRow;
  onEdit: (r: DataRow) => void;
}

export function emptyRowContentWidth() {
  return getRemSize() * 30;
}

export function EmptyRowContent(props: Props) {
  const { t } = useTranslation('DataTableModule');
  const { row, onEdit } = props;
  const handleEdit = useCallback(() => onEdit(row), [onEdit, row]);

  return (
    <button onClick={handleEdit} className={'btn btn-sm btn-link fst-italic'}>
      {t('There_is_no_data_yet_click_to_add_some')}
    </button>
  );
}
