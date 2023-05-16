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

import React, { useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { DataRow } from '../../core/data/data-source/DataSource';
import { LayerSelector } from '../../components/layer-selector/LayerSelector';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import DataTable from '../../components/data-table/DataTable';
import Cls from './DataTableView.module.scss';
import { useTranslation } from 'react-i18next';
import { ModuleTitle } from '../../components/module-title/ModuleTitle';
import clsx from 'clsx';
import { LayerDataSource } from '../../core/data/data-source/LayerDataSource';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DataViewSearchParams } from './DataViewSearchParams';
import { useMapLayers } from '../../core/geo/useMapLayers';
import { CsvParser } from '../../core/data/csv-parser/CsvParser';
import { CsvRow } from '../../core/data/csv-parser/typings';
import { useServices } from '../../core/useServices';
import { ModalStatus } from '../../core/ui/typings';
import { SetFeaturePropertiesChangeset } from '../../core/history/changesets/features/SetFeaturePropertiesChangeset';
import { HistoryKey } from '../../core/history/HistoryKey';
import { getFeature } from './getFeature';
import { RemoveFeaturesChangeset } from '../../core/history/changesets/features/RemoveFeaturesChangeset';
import { FileIO } from '../../core/utils/FileIO';
import isEqual from 'lodash/isEqual';
import { Routes } from '../../routes';
import { asNumberOrString } from '../../core/utils/numbers';
import { useShowDataTableView } from './useShowDataTableView';

const logger = Logger.get('DataTableView.tsx');

interface Props {
  layerId: string | undefined;
  onChange: (layerId: string | undefined) => void;
}

export function DataTableView(props: Props) {
  const { layerId: inMemoryLayerId, onChange } = props;
  const { t } = useTranslation('DataTableModule');
  const [data, setData] = useState<DataRow[]>();
  const [loading, setLoading] = useState(false);
  const [disableDownload, setDisableDownload] = useState<boolean>();
  const { layers } = useMapLayers();
  const { toasts, modals, history, geo } = useServices();
  const navigate = useNavigate();
  const showDataTable = useShowDataTableView();

  const showData = useCallback((layer: VectorLayerWrapper | undefined) => {
    if (!layer) {
      setData([]);
      setDisableDownload(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    new LayerDataSource(layer)
      .getRows()
      .then((data) => {
        setData(data);
        setDisableDownload(data.length < 1);
      })
      .catch((err) => {
        setData([]);
        setDisableDownload(true);
        logger.error('Data display error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Active Layer id is in search params
  const [searchParams] = useSearchParams();
  const searchParamKey: keyof DataViewSearchParams = 'layerId';
  const layerId = searchParams.get(searchParamKey) ?? inMemoryLayerId;
  const layer = layers.find((lay) => lay.getId() === layerId);

  // User selects a layer in selector
  const handleLayerSelected = useCallback(
    (_: unknown, layer: VectorLayerWrapper | undefined) => {
      onChange(layer?.getId());
      showDataTable(layer?.getId());
    },
    [onChange, showDataTable]
  );

  // Each time layer id change we show data
  useEffect(() => {
    if (layer && layer.isVector()) {
      showData(layer);
    }
  }, [layer, layerId, showData]);

  // User download data
  const handleDownload = useCallback(() => {
    if (!data?.length || !layer) {
      toasts.error(t('You_must_select_a_layer_with_data'));
      return;
    }

    const fileName = `${layer.getName()}.csv`;
    const csvRows: CsvRow[] = data.map((r) => {
      const result: CsvRow = {};
      for (const key in r.data) {
        const value = r.data[key];
        result[key] = asNumberOrString(value);
      }
      return result;
    });

    CsvParser.unparse(csvRows, fileName)
      .then((file) => FileIO.downloadBlob(file, fileName))
      .catch((err) => {
        logger.error('CSV parsing error:', err);
        toasts.genericError();
      });
  }, [data, layer, t, toasts]);

  // User edit a row
  const handleEdit = useCallback(
    (row: DataRow) => {
      if (!layer || !layer.isVector()) {
        logger.error('Bad layer:', layer);
        return;
      }

      const feature = getFeature(layer, row);
      if (!feature) {
        logger.error('Bad row:', row);
        return;
      }

      const before = feature.getDataProperties();

      modals
        .editPropertiesModal(before)
        .then((modalEvent) => {
          const after = modalEvent.properties;
          if (ModalStatus.Confirmed === modalEvent.status && !isEqual(before, after)) {
            const cs = new SetFeaturePropertiesChangeset(feature, before, after);
            cs.execute()
              .then(() => {
                showData(layer);
                history.register(HistoryKey.Map, cs);
              })
              .catch((err) => logger.error('Cannot set properties:', err));
          }
        })
        .catch((err) => logger.error('Error while editing feature properties:', err));
    },
    [history, layer, modals, showData]
  );

  // User delete a row
  const handleDelete = useCallback(
    (row: DataRow) => {
      if (!layer || !layer.isVector()) {
        logger.error('Bad layer:', layer);
        return;
      }

      const feature = getFeature(layer, row);
      if (!feature || !layer) {
        logger.error('Bad row :', row);
        return;
      }

      const cs = new RemoveFeaturesChangeset(layer.getSource(), [feature]);
      cs.execute()
        .then(() => {
          history.register(HistoryKey.Map, cs);
          showData(layer);
        })
        .catch((err) => logger.error('Cannot delete feature:', err));
    },
    [history, layer, showData]
  );

  // User show a feature on map
  const handleShowOnMap = useCallback(
    (row: DataRow) => {
      if (!layer || !layer.isVector()) {
        logger.error('Bad layer:', layer);
        return;
      }

      const feature = getFeature(layer, row);
      if (!feature || !layer) {
        logger.error('Bad row :', row);
        return;
      }

      const extent = feature.getGeometry()?.getExtent();
      if (extent) {
        navigate(Routes.map().format());
        geo.getMainMap().unwrap().getView().fit(extent);
        feature.setHighlighted(true, 3_000);
      }
    },
    [geo, layer, navigate]
  );

  return (
    <div className={Cls.container}>
      <ModuleTitle>{t('Data_tables')}</ModuleTitle>

      <div className={'d-flex flex-column'}>
        <div className={'my-3'}>{t('Select_a_layer')}</div>
        <div className={'d-flex flex-row align-items-center mb-4'}>
          <div className={clsx(Cls.vectorSelection, 'mr-3')}>
            <LayerSelector value={layer} onSelected={handleLayerSelected} onlyVector={true} data-cy={'layer-selector'} />
          </div>

          <button className={'mr-3 btn btn-secondary'} disabled={disableDownload} onClick={handleDownload} data-cy={'download'}>
            {t('Download_CSV')}
          </button>

          {!!data?.length && <div dangerouslySetInnerHTML={{ __html: t('X_entries', { entries: data.length }) }} />}
        </div>
      </div>

      {layer && !data?.length && !loading && <div className={'my-3'}>{t('No_data_to_display')}</div>}

      {loading && <div className={'my-3'}>{t('Loading_data')}</div>}

      {!!data?.length && (
        <DataTable
          rows={data}
          withActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShowOnmap={handleShowOnMap}
          className={Cls.dataTable}
          data-cy={'data-table'}
        />
      )}
    </div>
  );
}
