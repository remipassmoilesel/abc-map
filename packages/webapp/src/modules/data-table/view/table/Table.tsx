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

import Cls from './Table.module.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { DataRow } from '../../../../core/data/data-source/DataSource';
import { getAllFieldNames } from '../../../../core/data/getFieldNames';
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  Updater,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { OnChangeFn } from '@tanstack/table-core';
import { TableSettings } from '../state';
import { TableRow } from './TableRow';
import { RowActions } from './RowActions';
import { TableHeader } from './TableHeader';
import { useTranslation } from 'react-i18next';
import { LayerWrapper } from '../../../../core/geo/layers/LayerWrapper';
import { TableControls } from './TableControls';
import { getAllColumSizes, getColumnSize } from './helpers';
import { getRemSize } from '../../../../core/ui/getRemSize';
import { EmptyRowContent, emptyRowContentWidth } from './EmptyRowContent';
import { useFullscreen } from '../../../../core/ui/useFullscreen';

const logger = Logger.get('Table.tsx');

interface Props {
  layer: LayerWrapper | undefined;
  rows: DataRow[];
  // In pixels
  maxHeight: number;
  onSelect: (r: DataRow) => void;
  onEdit: (r: DataRow) => void;
  onDelete: (r: DataRow) => void;
  onShowOnMap: (r: DataRow) => void;
  settings: TableSettings;
  onSettingsChange: (settings: TableSettings) => void;
  disableCsv: boolean;
  onExportCsv: () => void;
  onImportCsv: () => void;
  onLayerSelected: (layer: LayerWrapper | undefined) => void;
}

const columnHelper = createColumnHelper<DataRow>();

const DefaultPagination: PaginationState = { pageSize: 20, pageIndex: 0 };

export function Table(props: Props) {
  const { t } = useTranslation('DataTableModule');
  const { layer, rows, maxHeight, onSelect, onEdit, onDelete, onShowOnMap, settings, onSettingsChange, onLayerSelected, onExportCsv, disableCsv, onImportCsv } =
    props;

  const handleSelect = useCallback((row: DataRow) => onSelect(row), [onSelect]);

  const handleEdit = useCallback((row: DataRow) => onEdit(row), [onEdit]);

  const handleDelete = useCallback((row: DataRow) => onDelete(row), [onDelete]);

  // We must ensure to use only displayed rows, otherwise it may cause performance issues
  const { startIndex, endIndex } = useMemo(() => {
    const index = settings.pagination?.pageIndex ?? 0;
    const size = settings.pagination?.pageSize ?? 40;
    const startIndex = index * size;
    const endIndex = startIndex + size;
    return { startIndex, endIndex };
  }, [settings.pagination?.pageIndex, settings.pagination?.pageSize]);

  const fieldNames = useMemo(() => getAllFieldNames(rows.slice(startIndex, endIndex)), [endIndex, rows, startIndex]);
  const sizes = useMemo(() => getAllColumSizes(rows.slice(startIndex, endIndex)), [endIndex, rows, startIndex]);

  const columns = useMemo(() => {
    // We add index column
    let columns: ColumnDef<DataRow, number>[] = [
      columnHelper.accessor((row: DataRow, index) => index, {
        id: 'index',
        cell: (info) => info.getValue() + 1,
        header: () => <b>#</b>,
        size: getColumnSize(rows.length),
        enableMultiSort: true,
        enableColumnFilter: false,
      }),
    ];

    // Then we add others
    if (fieldNames.length) {
      columns = columns.concat(
        fieldNames.map((fieldName) =>
          columnHelper.accessor((row: DataRow) => row.data[fieldName], {
            id: fieldName,
            cell: (info) => info.getValue(),
            header: () => <b>{fieldName}</b>,
            enableMultiSort: true,
            size: sizes[fieldName],
            maxSize: sizes[fieldName],
          })
        )
      );
    }
    // If no data is found, we add a button to prompt the user to create some
    else {
      columns = columns.concat(
        columnHelper.display({
          id: 'no_data',
          cell: (props) => <EmptyRowContent key={props.row.original.id} row={props.row.original} onEdit={handleEdit} />,
          size: emptyRowContentWidth(),
        })
      );
    }

    columns = columns.concat(
      columnHelper.display({
        id: 'actions',
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: (props) => <RowActions row={props.row} onSelect={handleSelect} onEdit={handleEdit} onDelete={handleDelete} onShowOnMap={onShowOnMap} />,
      })
    );

    return columns;
  }, [fieldNames, handleDelete, handleEdit, handleSelect, onShowOnMap, rows.length, sizes]);

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      let update: SortingState;
      if (typeof updaterOrValue === 'function') {
        update = updaterOrValue(settings.sorting ?? []);
      } else {
        update = updaterOrValue;
      }

      onSettingsChange({ ...settings, sorting: update });
    },
    [onSettingsChange, settings]
  );

  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      let update: PaginationState;
      if (typeof updaterOrValue === 'function') {
        update = updaterOrValue(settings.pagination ?? DefaultPagination);
      } else {
        update = updaterOrValue;
      }

      onSettingsChange({ ...settings, pagination: update });
    },
    [onSettingsChange, settings]
  );

  const debug = false;
  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting: settings.sorting,
      pagination: settings.pagination ?? DefaultPagination,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: debug,
    debugHeaders: debug,
    debugColumns: debug,
    autoResetPageIndex: false,
  });

  const { fullscreen } = useFullscreen();

  // We compute how much rows fit in
  const [optimalPageSize, setOptimalPageSize] = useState(10);
  useEffect(() => {
    const availableHeight = maxHeight * 0.85;
    const rowHeight = 3 * getRemSize();
    let pageSize = Math.round(availableHeight / rowHeight);

    pageSize = Math.min(pageSize, 20);
    pageSize = Math.max(pageSize, 10);

    setOptimalPageSize(pageSize);
  }, [fullscreen, maxHeight, table]);

  return (
    <div className={Cls.container}>
      <TableControls
        layer={layer}
        table={table}
        onLayerSelected={onLayerSelected}
        disableCsv={disableCsv}
        onExportCsv={onExportCsv}
        onImportCsv={onImportCsv}
        optimalPageSize={optimalPageSize}
        className={'mb-2'}
      />

      {layer && !layer.isVector() && <div className={'my-3'}>{t('This_layer_does_not_contain_data_that_can_be_used_in_this_module')}</div>}
      {layer?.isVector() && !rows.length && <div className={'my-3'}>{t('No_data_to_display')}</div>}

      {layer?.isVector() && !!rows.length && (
        <table style={{ width: table.getTotalSize() }} className={clsx('table table-bordered table-hover')}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeader key={header.id} table={table} header={header} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} row={row} />
            ))}
            {!table.getRowModel().rows.length && (
              <tr>
                <td colSpan={9999}>{t('No_data_to_display')}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
