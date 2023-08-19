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

import { Column, flexRender, Header, Table } from '@tanstack/react-table';
import React, { ChangeEvent, MouseEvent, ReactNode, Ref, useCallback } from 'react';
import { DataRow } from '../../../../core/data/data-source/DataSource';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefs } from '../../../../components/icon/IconDefs';
import Cls from './TableHeader.module.scss';
import clsx from 'clsx';

interface Props {
  table: Table<DataRow>;
  header: Header<DataRow, unknown>;
}

interface CustomToggleProps {
  children: ReactNode;
  onClick: (ev: MouseEvent<HTMLButtonElement>) => void;
}

const CustomToggle = React.forwardRef(function CustomToggle({ children, onClick }: CustomToggleProps, ref) {
  return (
    <button ref={ref as Ref<HTMLButtonElement>} onClick={onClick} className={Cls.filterButton}>
      {children}
    </button>
  );
});

export function TableHeader(props: Props) {
  const { t } = useTranslation('DataTableModule');
  const { table, header } = props;
  const column = header.column;
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const numberValues = typeof firstValue === 'number';

  const withMenu = column.getCanFilter() || column.getCanSort();

  const handleSortAsc = useCallback(
    (ev: MouseEvent<unknown>) => {
      ev.stopPropagation();

      if (column.getIsSorted() !== 'asc') {
        column.toggleSorting(false);
      } else {
        column.clearSorting();
      }
    },
    [column]
  );

  const handleSortDesc = useCallback(
    (ev: MouseEvent<unknown>) => {
      ev.stopPropagation();

      if (column.getIsSorted() !== 'desc') {
        column.toggleSorting(true);
      } else {
        column.clearSorting();
      }
    },
    [column]
  );

  const handleReset = useCallback(
    (ev: MouseEvent<unknown>) => {
      ev.stopPropagation();

      column.clearSorting();
      column.setFilterValue(undefined);
    },
    [column]
  );

  const sortOrder: 'asc' | 'desc' | false = column.getIsSorted();

  const filterActive = column.getIsSorted() || column.getIsFiltered();

  // When user changes filters, we must reset page index to return to the first page.
  // Otherwise, when we use filter on another page (4 per example), results are not visible
  const handleFilterChange = useCallback(() => {
    table.resetPageIndex();
  }, [table]);

  return (
    <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }} scope="col" data-cy={'table-header'}>
      {header.isPlaceholder ? null : (
        <>
          {!withMenu && <div>{flexRender(column.columnDef.header, header.getContext())}</div>}
          {withMenu && (
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle}>
                <div className={'me-2'}>{flexRender(column.columnDef.header, header.getContext())}</div>
                <FontAwesomeIcon icon={IconDefs.faFilter} className={clsx(filterActive && Cls.filterActive)}></FontAwesomeIcon>
              </Dropdown.Toggle>

              <Dropdown.Menu className={Cls.dropdownMenu}>
                <Dropdown.ItemText className={'fw-normal'}>{t('Sort_data')}</Dropdown.ItemText>
                <Dropdown.Item className={'d-flex align-items-center fw-normal ps-4'} onClick={handleSortAsc}>
                  <div className={'me-2'}>{t('Ascending_order')}</div>
                  <div className={Cls.sortIcon}>{sortOrder === 'asc' && <FontAwesomeIcon icon={IconDefs.faArrowUp}></FontAwesomeIcon>}</div>
                </Dropdown.Item>
                <Dropdown.Item className={'d-flex align-items-center fw-normal ps-4'} onClick={handleSortDesc}>
                  <div className={'me-2'}>{t('Descending_order')}</div>
                  <div className={Cls.sortIcon}>{sortOrder === 'desc' && <FontAwesomeIcon icon={IconDefs.faArrowDown}></FontAwesomeIcon>}</div>
                </Dropdown.Item>

                {column.getCanFilter() ? (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.ItemText className={'fw-normal'}>{t('Filter_data')}</Dropdown.ItemText>
                    <Dropdown.ItemText className={'ps-4'}>
                      {numberValues && <NumberFilter column={column} onChange={handleFilterChange}></NumberFilter>}
                      {!numberValues && <StringFilter column={column} onChange={handleFilterChange}></StringFilter>}
                    </Dropdown.ItemText>
                  </>
                ) : null}

                <Dropdown.Divider />
                <Dropdown.Item onClick={handleReset}>
                  <FontAwesomeIcon icon={IconDefs.faTimes} className={'me-2'}></FontAwesomeIcon>
                  {t('Reset')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </>
      )}
    </th>
  );
}

interface FilterProps {
  column: Column<DataRow>;
  onChange: () => void;
}

function StringFilter(props: FilterProps) {
  const { column, onChange } = props;
  const { t } = useTranslation('DataTableModule');
  const columnFilterValue = column.getFilterValue() as string | undefined;

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      column.setFilterValue(ev.target.value);
      onChange();
    },
    [column, onChange]
  );

  return (
    <div className="d-flex w-100">
      <input type="text" value={columnFilterValue || ''} onChange={handleChange} placeholder={t('Search')} className="border rounded w-100" />
    </div>
  );
}

type NumberFilterValue = [number, number];

function NumberFilter(props: FilterProps) {
  const { column, onChange } = props;
  const { t } = useTranslation('DataTableModule');
  const columnFilterValue = column.getFilterValue() as NumberFilterValue | undefined;

  const handleMinChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      column.setFilterValue((old: NumberFilterValue | undefined) => [ev.target.value, old?.[1]]);
      onChange();
    },
    [column, onChange]
  );

  const handleMaxChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      column.setFilterValue((old: NumberFilterValue | undefined) => [old?.[0], ev.target.value]);
      onChange();
    },
    [column, onChange]
  );

  return (
    <div className={Cls.numberFilter}>
      <input type="number" value={columnFilterValue?.[0] ?? ''} onChange={handleMinChange} placeholder={t(`Min`)} className={'form-control form-control-sm'} />
      <input type="number" value={columnFilterValue?.[1] ?? ''} onChange={handleMaxChange} placeholder={t(`Max`)} className={'form-control form-control-sm'} />
    </div>
  );
}
