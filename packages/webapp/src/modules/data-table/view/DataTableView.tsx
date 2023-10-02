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

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { DataRow } from '../../../core/data/data-source/DataSource';
import { LayerWrapper, VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import Cls from './DataTableView.module.scss';
import { useTranslation } from 'react-i18next';
import { ModuleTitle } from '../../../components/module-title/ModuleTitle';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMapLayers } from '../../../core/geo/useMapLayers';
import { useServices } from '../../../core/useServices';
import { ModalStatus } from '../../../core/ui/typings';
import { SetFeaturePropertiesChangeset } from '../../../core/history/changesets/features/SetFeaturePropertiesChangeset';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { RemoveFeaturesChangeset } from '../../../core/history/changesets/features/RemoveFeaturesChangeset';
import isEqual from 'lodash/isEqual';
import { Routes } from '../../../routes';
import { useShowDataTableModule } from '../useShowDataTableModule';
import { Table } from './table/Table';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { TableSettings, usePersistentStore } from './state';
import { CsvImportModal } from './CsvImportModal';
import { useCsv } from './useCsv';
import { HistoryKeyboardListener } from '../../../core/ui/HistoryKeyboardListener';
import { useDataRows } from './useDataRows';
import { ResizeObserverFactory } from '../../../core/utils/ResizeObserverFactory';
import debounce from 'lodash/debounce';

const logger = Logger.get('DataTableView.tsx');

export function DataTableView() {
  const { t } = useTranslation('DataTableModule');
  const { toasts, modals, history, geo } = useServices();

  const navigate = useNavigate();
  const showDataTable = useShowDataTableModule();

  const { layers, activeLayer } = useMapLayers();

  // Active Layer id is in search params
  const [searchParams] = useSearchParams();
  const searchParamKey = 'layerId';
  const layerId = searchParams.get(searchParamKey) || activeLayer?.getId();
  const layer = layers.find((lay) => lay.getId() === layerId);

  const { rows, disableCsv } = useDataRows(layer);
  const { exportFile } = useCsv(layer, rows);
  const [importModal, setImportModal] = useState(false);

  // User selects a layer in selector
  const handleLayerSelected = useCallback(
    (layer: LayerWrapper | undefined) => {
      showDataTable(layer?.getId());
    },
    [showDataTable]
  );

  // User download data
  const handleExport = useCallback(() => {
    if (!rows.length || !layer) {
      toasts.error(t('You_must_select_a_layer_with_data'));
      return;
    }

    exportFile();
  }, [rows.length, layer, exportFile, toasts, t]);

  // User imports data into current layer
  const handleImport = useCallback(() => {
    if (!layer?.isVector() || !layer?.getSource().getFeatures().length) {
      toasts.error(t('You_must_select_a_layer_with_data'));
      return;
    }

    setImportModal(true);
  }, [layer, t, toasts]);

  const handleImportModalClosed = useCallback(() => setImportModal(false), []);

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
              .then(() => history.register(HistoryKey.Map, cs))
              .catch((err) => logger.error('Cannot set properties:', err));
          }
        })
        .catch((err) => logger.error('Error while editing feature properties:', err));
    },
    [history, layer, modals]
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
        .then(() => history.register(HistoryKey.Map, cs))
        .catch((err) => logger.error('Cannot delete feature:', err));
    },
    [history, layer]
  );

  // User shows a feature on map
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

  // User selects a feature
  const handleSelectFeature = useCallback(
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

      const selection = geo.getMainMap().getSelection();
      if (feature.isSelected()) {
        selection.remove([feature.unwrap()]);
      } else {
        selection.add([feature.unwrap()]);
      }
    },
    [geo, layer]
  );

  // TODO: use zustand store in all modules and in module template
  const state = usePersistentStore((state) => state);

  const tableSettings: TableSettings = useMemo(() => {
    return {
      sorting: layerId ? state.sortingByLayerId[layerId] : undefined,
      pagination: layerId ? state.paginationByLayerId[layerId] : undefined,
    };
  }, [layerId, state.paginationByLayerId, state.sortingByLayerId]);

  const handleSettingsChange = useCallback(
    (settings: TableSettings) => {
      if (layerId) {
        state.setSettings(layerId, {
          sorting: settings.sorting,
          pagination: settings.pagination,
        });
      }
    },
    [layerId, state]
  );

  // We listen for undo / redo key strokes
  useEffect(() => {
    const listener = HistoryKeyboardListener.create(HistoryKey.Map);
    return () => listener.initialize();
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tableHeight, setTableHeight] = useState(300);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      logger.warn('Not ready');
      return;
    }

    const adaptDisplay = () => {
      const containerHeight = containerRef.current?.clientHeight ?? 1080;
      setTableHeight(Math.round(containerHeight * 0.85));
    };

    adaptDisplay();

    const observer = ResizeObserverFactory.create(debounce(adaptDisplay, 100));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={Cls.container} ref={containerRef}>
      <ModuleTitle className={'my-3'}>{t('Data_tables')}</ModuleTitle>

      <Table
        layer={layer}
        rows={rows}
        maxHeight={tableHeight}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShowOnMap={handleShowOnMap}
        onSelect={handleSelectFeature}
        settings={tableSettings}
        onSettingsChange={handleSettingsChange}
        disableCsv={disableCsv}
        onExportCsv={handleExport}
        onImportCsv={handleImport}
        onLayerSelected={handleLayerSelected}
        data-cy={'data-table'}
      />

      {importModal && <CsvImportModal layer={layer} rows={rows} onClose={handleImportModalClosed} />}
    </div>
  );
}

function getFeature(layer: VectorLayerWrapper, row: DataRow): FeatureWrapper | undefined {
  const feature = layer
    .getSource()
    .getFeatures()
    .find((f) => f.getId() === row.id);
  if (!feature) {
    return;
  }

  return FeatureWrapper.from(feature);
}
