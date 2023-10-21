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

import React, { useCallback } from 'react';
import Cls from './ImportData.module.scss';
import { AbcFile, Logger } from '@abc-map/shared';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import { useTranslation } from 'react-i18next';
import { DataReader } from '../../../core/data/DataReader';
import { ReadStatus } from '../../../core/data/ReadResult';
import { useServices } from '../../../core/useServices';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../../routes';
import { BundledModuleId } from '@abc-map/shared';

const logger = Logger.get('ImportData.tsx');

export function ImportData() {
  const { toasts } = useServices();
  const { t } = useTranslation('MapView');
  const navigate = useNavigate();

  const handleBrowseDocumentation = useCallback(() => navigate(Routes.module().withParams({ moduleId: BundledModuleId.Documentation })), [navigate]);

  const handleImportLocalFile = useCallback(() => {
    const dataReader = DataReader.create();

    const selectFiles = async (): Promise<AbcFile<Blob>[] | undefined> => {
      const result = await FileIO.openPrompt(InputType.Multiple);
      if (InputResultType.Canceled === result.type) {
        return;
      }

      return result.files.map((f) => ({ path: f.name, content: f }));
    };

    const importFiles = async (files: AbcFile<Blob>[]) => {
      const result = await dataReader.importFiles(files);

      if (result.status === ReadStatus.Failed) {
        toasts.error(t('Formats_not_supported'));
      }
    };

    let firstToast = '';
    selectFiles()
      .then((files) => {
        if (files) {
          firstToast = toasts.info(t('Import_in_progress'));
          return importFiles(files);
        }
      })
      .catch((err) => {
        logger.error('File import error:', err);
        toasts.genericError();
      })
      .finally(() => {
        if (firstToast) {
          toasts.dismiss(firstToast);
        }
      });
  }, [t, toasts]);

  const handleBrowseDatastore = useCallback(() => navigate(Routes.module().withParams({ moduleId: BundledModuleId.DataStore })), [navigate]);

  return (
    <div className={'d-flex flex-column p-3'}>
      <h5 className={'mb-3'}>{t('Import_data')}</h5>

      <div className={'d-flex flex-column align-items-start mb-2'}>
        <div className={'mb-2'}>{t('You_can_display_on_the_map')}:</div>
        <ul>
          <li>{t('GPX_files')}</li>
          <li>{t('KML_files')}</li>
          <li>{t('GeoJSON_files')}</li>
          <li>{t('TopoJSON_files')}</li>
          <li>{t('Shapefiles')}</li>
          <li>{t('WMS_layer_definitions')}</li>
          <li>{t('WMTS_layer_definitions')}</li>
          <li>{t('XYZ_layer_definitions')}</li>
        </ul>
      </div>

      <div className={'alert alert-info mb-3'}>
        <div className={'mb-3'}>{t('You_can_also_use_CSV_files_but_with_a_data_processing_module')}</div>

        <div className={'d-flex justify-content-end'}>
          <button onClick={handleBrowseDocumentation} className={'btn btn-sm btn-outline-primary'}>
            {t('See_documentation')}
          </button>
        </div>
      </div>

      <div className={'fw-bold my-4'}>{t('There_are_several_ways_to_import_data')}</div>

      <div className={Cls.importChoice}>{t('You_can_drop_files_directly_on_map')}</div>

      <div className={Cls.importChoice}>
        <div className={'mb-3'}>{t('You_can_browse_local_files')}</div>
        <div className={'d-flex justify-content-end'}>
          <button onClick={handleImportLocalFile} className={'btn btn-sm btn-outline-primary'} data-cy={'browse-files'}>
            {t('Browse')}
          </button>
        </div>
      </div>

      <div className={Cls.importChoice}>
        <div className={'mb-3'}>{t('You_can_browse_the_data_store')}</div>
        <div className={'d-flex justify-content-end'}>
          <button onClick={handleBrowseDatastore} className={'btn btn-sm btn-primary'}>
            {t('Show_data_store')}
          </button>
        </div>
      </div>
    </div>
  );
}
