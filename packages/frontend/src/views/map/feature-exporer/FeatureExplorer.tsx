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

import Cls from './FeatureExplorer.module.scss';
import { useMapLayers } from '../../../core/geo/useMapLayers';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { useTranslation } from 'react-i18next';
import { FeatureCard } from './feature-card/FeatureCard';
import { useServices } from '../../../core/useServices';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { RemoveFeaturesChangeset } from '../../../core/history/changesets/features/RemoveFeaturesChangeset';
import { ModalStatus } from '../../../core/ui/typings';
import isEqual from 'lodash/isEqual';
import { SetFeaturePropertiesChangeset } from '../../../core/history/changesets/features/SetFeaturePropertiesChangeset';
import clsx from 'clsx';
import { useIndexedSearch } from '../../../core/utils/useIndexedSearch';
import { useFeatures } from './useFeatures';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { Settings } from './Settings';
import { SettingsModal } from './settings-modal/SettingsModal';
import { WithTooltip } from '../../../components/with-tooltip/WithTooltip';
import { LayerSelector } from '../../../components/layer-selector/LayerSelector';
import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';

export const logger = Logger.get('FeatureExplorer.ts', 'debug');

const indexifyFeature = (feature: FeatureWrapper) => Object.values(feature.getDataProperties()).map((v) => `${v}`);

export function FeatureExplorer() {
  const { geo, history, modals } = useServices();
  const { t } = useTranslation('MapView');

  // Vector layer and data
  const { map, activeVectorLayer: activeLayer } = useMapLayers();
  const handleLayerChange = useCallback((_: unknown, layer: VectorLayerWrapper | undefined) => map.setActiveLayer(layer), [map]);

  const { loading, features, fieldNames, nameField: defaultNameField } = useFeatures(activeLayer);

  // Settings
  const [settings, setSettings] = useState<Settings>({ nameField: defaultNameField });
  const [settingsModal, showSettingsModal] = useState(false);
  const handleSettingsChanged = useCallback((settings: Settings) => {
    setSettings(settings);
    showSettingsModal(false);
  }, []);

  const handleToggleSettingsModal = useCallback(() => showSettingsModal((st) => !st), []);

  // If there is no name field, we select one
  useEffect(() => {
    if (!settings.nameField && defaultNameField) {
      setSettings((settings) => ({ ...settings, nameField: defaultNameField }));
    }
  }, [defaultNameField, settings.nameField]);

  const mainField = settings.nameField ?? defaultNameField;

  // Search
  const [query, setQuery] = useState<string>('');
  const { search: searchFeatures, results: searchResults } = useIndexedSearch<FeatureWrapper>(features, indexifyFeature);
  const displayedFeatures = query ? searchResults : features;

  const handleHighlightFeature = useCallback((feature: FeatureWrapper) => {
    feature.setHighlighted(true, 5_000);
  }, []);

  const handleZoomOn = useCallback(
    (feature: FeatureWrapper) => {
      const map = geo.getMainMap();
      const extent = feature.getGeometry()?.getExtent();
      if (extent) {
        map.unwrap().getView().fit(extent);
        feature.setHighlighted(true, 1_500);
      }
    },
    [geo]
  );

  const handleDelete = useCallback(
    (feature: FeatureWrapper) => {
      if (!activeLayer) {
        logger.error('Not ready');
        return;
      }

      const cs = new RemoveFeaturesChangeset(activeLayer.getSource(), [feature]);
      cs.execute()
        .then(() => history.register(HistoryKey.Map, cs))
        .catch((err) => logger.error('Deletion error: ', err));
    },
    [activeLayer, history]
  );

  const handleSelect = useCallback((feature: FeatureWrapper) => {
    feature.setSelected(!feature.isSelected());
    feature.setHighlighted(false);
  }, []);

  const handleEditFeature = useCallback(
    (feature: FeatureWrapper) => {
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
    [history, modals]
  );

  const handleSearch = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const query = ev.target.value;
      setQuery(query);

      if (query) {
        searchFeatures(query);
      }
    },
    [searchFeatures]
  );

  return (
    <div className={clsx('h-100 d-flex flex-column justify-content-start p-3')}>
      <div className={'d-flex align-items-center mb-3'}>
        <h5 className={'me-3'}>{t('Feature_explorer')}</h5>

        <WithTooltip title={t('The_explorer_allows_you_to_view_and_modify_the_data_of_your_layers')}>
          <div>
            <FaIcon icon={IconDefs.faInfoCircle} size={'1.2rem'} />
          </div>
        </WithTooltip>
      </div>

      <div className={'d-flex flex-row mb-2'}>
        <LayerSelector value={activeLayer} onSelected={handleLayerChange} onlyVector={true} />
      </div>

      <div className={'d-flex flex-column mb-2'}>
        <div className={'d-flex align-items-center'}>
          <input
            type={'text'}
            placeholder={t('Search_in_data')}
            value={query}
            onChange={handleSearch}
            disabled={loading || !activeLayer}
            className={'form-control me-2'}
            data-testid={'search-query'}
          />

          <button onClick={handleToggleSettingsModal} className={'btn btn-outline-secondary'} data-testid={'settings'}>
            <FaIcon icon={IconDefs.faGear} />
          </button>

          {settingsModal && (
            <SettingsModal value={settings} nameFieldCandidate={fieldNames} onConfirm={handleSettingsChanged} onCancel={handleToggleSettingsModal} />
          )}
        </div>
      </div>

      <div className={clsx(Cls.list, 'p-1')}>
        {loading && <div className={'my-4'}>{t('Loading')}</div>}

        {!activeLayer && <div className={'my-3'}>{t('Select_a_vector_layer_to_view_its_data')}</div>}
        {activeLayer && !query && !displayedFeatures.length && !loading && <div>{t('This_layer_contains_no_data')}</div>}
        {activeLayer && query && !displayedFeatures.length && !loading && <div>{t('Nothing_match')}</div>}

        {activeLayer &&
          displayedFeatures.map((feature, index) => {
            return (
              <FeatureCard
                key={feature.getId() ?? `BAD-ID-${index}`}
                index={index + 1}
                feature={feature}
                onHighlight={handleHighlightFeature}
                mainField={mainField}
                onZoomOn={handleZoomOn}
                onDelete={handleDelete}
                onToggleSelect={handleSelect}
                onEdit={handleEditFeature}
                className={'mb-1'}
              />
            );
          })}
      </div>
    </div>
  );
}
