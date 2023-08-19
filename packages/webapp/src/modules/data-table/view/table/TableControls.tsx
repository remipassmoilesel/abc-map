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

import { Table as TanstackTable } from '@tanstack/table-core';
import { DataRow } from '../../../../core/data/data-source/DataSource';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { LayerSelector } from '../../../../components/layer-selector/LayerSelector';
import { LayerWrapper } from '../../../../core/geo/layers/LayerWrapper';
import Cls from './TableControls.module.scss';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  layer: LayerWrapper | undefined;
  table: TanstackTable<DataRow>;
  onLayerSelected: (layer: LayerWrapper | undefined) => void;
  disableCsv: boolean;
  onExportCsv: () => void;
  onImportCsv: () => void;
  optimalPageSize: number;
  className?: string;
}

export function TableControls(props: Props) {
  const { layer, table, onLayerSelected, disableCsv, onExportCsv, onImportCsv, optimalPageSize, className } = props;
  const { t } = useTranslation('DataTableModule');

  const pagination = table.getState().pagination;

  const handleGoFirst = useCallback(() => table.setPageIndex(0), [table]);
  const handleGoPrevious = useCallback(() => table.previousPage(), [table]);
  const handleGoNext = useCallback(() => table.nextPage(), [table]);
  const handleGoLast = useCallback(() => table.setPageIndex(table.getPageCount() - 1), [table]);

  const [goToPageValue, setGoToPageValue] = useState(pagination.pageIndex);
  const handleGoToPage = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const page = parseInt(ev.target.value);
      if (!isNaN(page)) {
        setGoToPageValue(page);
        table.setPageIndex(page - 1);
      }
    },
    [table]
  );

  const handleLimitChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const nbr = parseInt(ev.target.value);
      table.setPageSize(nbr);
    },
    [table]
  );

  useEffect(() => {
    setGoToPageValue(pagination.pageIndex + 1);
  }, [pagination.pageIndex]);

  useEffect(() => {
    table.setPageSize(optimalPageSize);
  }, [optimalPageSize, table]);

  return (
    <div className={clsx(Cls.container, className)}>
      <div className={'d-flex align-items-center me-4 mb-2'}>
        <div className={'me-2'}>{t('Layer')}</div>
        <LayerSelector value={layer} onSelected={onLayerSelected} data-cy={'layer-selector'} />
      </div>

      {layer?.isVector() && (
        <>
          <div className="d-flex align-items-center me-4 mb-2">
            <button className="btn btn-sm btn-outline-secondary me-1" onClick={handleGoFirst} disabled={!table.getCanPreviousPage()}>
              {'<<'}
            </button>
            <button className="btn btn-sm btn-outline-secondary me-1" onClick={handleGoPrevious} disabled={!table.getCanPreviousPage()}>
              {'<'}
            </button>

            <div className="d-flex align-items-center mx-2">
              <div className={'me-1'}>{t('Page')}</div>
              <div className={'fw-bold'}>
                {pagination.pageIndex + 1} / {table.getPageCount()}
              </div>
            </div>

            <button className="btn btn-sm btn-outline-secondary me-1" onClick={handleGoNext} disabled={!table.getCanNextPage()}>
              {'>'}
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleGoLast} disabled={!table.getCanNextPage()}>
              {'>>'}
            </button>
          </div>

          <div className="d-flex align-items-center me-2 mb-2">
            <div className={'text-nowrap me-2'}>{t('Go_to')}</div>
            <input type="number" value={goToPageValue} onChange={handleGoToPage} className={clsx('me-2 form-control form-control-sm', Cls.goToInput)} />
            <button disabled={pagination.pageIndex + 1 === goToPageValue} onClick={handleGoFirst} className={'btn btn-sm btn-outline-secondary'}>
              <FontAwesomeIcon icon={IconDefs.faTimes} />
            </button>
          </div>

          <div className="d-flex align-items-center me-4 mb-2">
            <select value={pagination.pageSize} onChange={handleLimitChange} className={'form-select form-select-sm'}>
              {[optimalPageSize, 50, 75].map((i) => (
                <option key={i} value={i}>
                  {t('Show')} {i} {t('rows')}
                </option>
              ))}
            </select>
          </div>

          <button onClick={onExportCsv} disabled={disableCsv} className={'btn btn-sm btn-outline-secondary me-3 mb-2'} data-cy={'csv-export'}>
            <FontAwesomeIcon icon={IconDefs.faDownload} className={'me-2'} />
            {t('CSV_export')}
          </button>

          <button onClick={onImportCsv} disabled={disableCsv} className={'btn btn-sm btn-outline-secondary me-3 mb-2'} data-cy={'csv-import-modal'}>
            <FontAwesomeIcon icon={IconDefs.faUpload} className={'me-2'} />
            {t('CSV_import')}
          </button>
        </>
      )}
    </div>
  );
}
