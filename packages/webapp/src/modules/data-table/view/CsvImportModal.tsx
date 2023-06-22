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

import { Modal } from 'react-bootstrap';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { errorMessage } from '@abc-map/shared';
import { isCsvParsingError, UnknownLineNumber } from '../../../core/data/csv-parser/typings';
import { CsvLineIdFieldName, useCsv } from './useCsv';
import { DataRow } from '../../../core/data/data-source/DataSource';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import Cls from './CsvImportModal.module.scss';
import clsx from 'clsx';

interface Props {
  layer: LayerWrapper | undefined;
  rows: DataRow[];
  onClose: () => void;
}

export interface ImportResult {
  file: File | undefined;
  skipped: number;
  skippedIds: string[];
  imported: number;
  error: unknown;
}

export function CsvImportModal(props: Props) {
  const { layer, rows, onClose } = props;
  const { t } = useTranslation('DataTableModule');

  const { result, importFile } = useCsv(layer, rows);

  const errorAtLine = result?.error && isCsvParsingError(result.error) ? result.error.line : UnknownLineNumber;

  const fileDesc = useCallback(
    () =>
      !!result?.file && (
        <div className={'mb-2'}>
          {t('File')}: {result.file.name} ({t('Modified_at')} {DateTime.fromMillis(result.file?.lastModified).toFormat('HH:MM dd/LL')})
        </div>
      ),
    [result?.file, t]
  );

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>{t('CSV_import')}</Modal.Header>
      <Modal.Body className={clsx(Cls.modal, 'd-flex flex-column')}>
        <div className={'alert alert-info mb-2'}>{t('You_can_import_a_CSV_file_to_edit_layer_data')}</div>

        <div className={'p-1 m-2'}>
          <div>{t('For_the_import_to_work_correctly')}</div>
          <ul>
            <li>{t('Import_only_files_exported_with_the_Export_CSV_button')}</li>
            <li>{t('Preserve_XX_column_values', { id: CsvLineIdFieldName })}</li>
          </ul>
        </div>

        <div className={'mb-2 fw-bold'}>{t('Attention_you_cannot_cancel_a_CSV_import')}</div>

        <div className={'d-flex align-items-center w-100 mb-4'}>
          <button className={'btn btn-primary'} onClick={importFile} data-cy={'csv-import'}>
            <FontAwesomeIcon icon={IconDefs.faUpload} className={'me-2'} />
            {t('Import_a_CSV_file')}
          </button>
        </div>

        {result && !result.error && (
          <>
            <div className={'fw-bold mb-2'}>{t('Import_is_complete')}</div>

            <div className={'mb-2 ps-2'}>
              {fileDesc()}

              <div className={'mb-2'} data-cy={'rows-imported'}>
                {result.imported}&nbsp;{t('rows_modified')}
              </div>
              <div className={'mb-2'} data-cy={'rows-skipped'}>
                {result.skipped}&nbsp;{t('rows_skipped')}
              </div>
              {!!result.skipped && (
                <div className={'alert alert-warning mt-3 mb-2'}>
                  <div className={'fw-bold d-flex align-items-center mb-3'}>
                    <FaIcon icon={IconDefs.faExclamationTriangle} className={'me-2'} />
                    {t('Lines_were_skipped_during_import')}
                  </div>
                  <div className={'mb-2'}>{t('You_should_probably_export_again_and_check_the_values_of_the_id_columns')}</div>
                  <div>
                    {t('Skipped_rows')}:{' '}
                    {result.skippedIds.slice(0, 5).map((id, i) => (
                      <>
                        &quot;<code key={id + i}>{id}</code>&quot;,&nbsp;
                      </>
                    ))}{' '}
                    {result.skippedIds.length > 5 && '...'}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!!result?.error && (
          <>
            <div className={'fw-bold mb-2'}>{t('Import_error')}</div>

            <div className={'mb-2 ps-2'}>
              <div className={'alert alert-warning mb-3'}>
                <div className={'fw-bold d-flex align-items-center mb-3'}>
                  <FaIcon icon={IconDefs.faExclamationTriangle} className={'me-2'} />
                  <div>{t('The_import_did_not_complete_successfully')}</div>
                </div>
                <div>{t('You_should_probably_check_the_input_data')}</div>
              </div>

              {fileDesc()}

              <div className={'d-flex flex-column mb-2'}>
                <div className={'mb-2'}>{t('Error_message')}:</div>
                {errorAtLine !== UnknownLineNumber && (
                  <code className={'py-2 ps-1'}>
                    {t('Error_at_line')} {errorAtLine}
                  </code>
                )}
                <code className={'py-2 ps-1'}>{errorMessage(result?.error)}</code>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className={'d-flex align-items-end'}>
        <button onClick={onClose} className={'btn btn-outline-secondary'} data-cy={'close-import-modal'}>
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
