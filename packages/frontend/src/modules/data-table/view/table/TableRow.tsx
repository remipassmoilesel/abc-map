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

import { flexRender, Row } from '@tanstack/react-table';
import React from 'react';
import { DataRow } from '../../../../core/data/data-source/DataSource';
import clsx from 'clsx';
import Cls from './TableRow.module.scss';

interface Props {
  row: Row<DataRow>;
}

export function TableRow(props: Props) {
  const { row } = props;

  const selected = row.original.metadata.selected;

  return (
    <tr className={clsx(selected && Cls.selected)}>
      {row.getVisibleCells().map((cell) => {
        return (
          <td key={cell.id} style={{ width: cell.column.getSize() }} className={Cls.cell} data-cy={'table-cell'}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
