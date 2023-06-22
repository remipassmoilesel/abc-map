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

import Cls from './LayerControls.module.scss';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Logger } from '@abc-map/shared';
import LayerListItem from './list-item/LayerListItem';
import AddLayerModal from './add-layer-modal/AddLayerModal';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import EditLayerModal from './edit-layer-modal/EditLayerModal';
import { useTranslation } from 'react-i18next';
import { WithTooltip } from '../../../components/with-tooltip/WithTooltip';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import isEqual from 'lodash/isEqual';
import { usePrevious } from '../../../core/utils/usePrevious';
import { useServices } from '../../../core/useServices';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { Extent, getArea } from 'ol/extent';
import { RemoveLayerChangeset } from '../../../core/history/changesets/layers/RemoveLayerChangeset';
import { ToggleLayerVisibilityChangeset } from '../../../core/history/changesets/layers/ToggleLayerVisibilityChangeset';
import { SetLayerPositionChangeset } from '../../../core/history/changesets/layers/SetLayerPositionChangeset';
import { useMapLayers } from '../../../core/geo/useMapLayers';
import { SetActiveLayerChangeset } from '../../../core/history/changesets/layers/SetActiveLayerChangeset';
import { useShowDataTableModule } from '../../../modules/data-table/useShowDataTableModule';

const logger = Logger.get('LayerControls.tsx');

export function LayerControls() {
  const { layers, activeLayer, activeVectorLayer } = useMapLayers();
  const { geo, toasts, history } = useServices();
  const { t } = useTranslation('MapView');
  const showDataTableView = useShowDataTableModule();

  const [editedLayer, setEditedLayer] = useState<LayerWrapper | undefined>();
  const [addModalVisible, setAddModalVisible] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const layerIds = layers.map((layer) => layer.getId());
  const previousIds = usePrevious(layerIds);
  useEffect(() => {
    if (!isEqual(previousIds, layerIds)) {
      // We scroll to bottom of list if layer list change
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }
  }, [layerIds, previousIds]);

  const handleSelection = useCallback(
    (layerId: string) => {
      const layer = layers.find((lay) => lay.getId() === layerId);
      if (!layer) {
        toasts.genericError(new Error(`Layer not found: ${layerId}`));
        return;
      }

      if (activeLayer?.getId() === layerId) {
        return;
      }

      // We set it active
      const setActiveLayer = SetActiveLayerChangeset.create(layer);
      setActiveLayer
        .execute()
        // We register action in history
        .then(() => history.register(HistoryKey.Map, setActiveLayer))
        .catch((err) => logger.error('Cannot set layer active', err));
    },
    [activeLayer, history, layers, toasts]
  );

  const handleZoom = useCallback(() => {
    if (!activeLayer) {
      toasts.info(t('You_must_first_select_layer'));
      return;
    }

    let extent: Extent | undefined;
    if (activeLayer.isVector()) {
      extent = activeLayer.getSource().getExtent();
    } else {
      extent = activeLayer.unwrap().getExtent();
    }

    if (!extent || !getArea(extent)) {
      toasts.info(t('Unable_to_zoom'));
      logger.error('Layer does not have an extent, or extent is invalid');
      return;
    }

    geo.getMainMap().unwrap().getView().fit(extent);
  }, [activeLayer, geo, t, toasts]);

  const handleToggleAddLayerModal = useCallback(() => setAddModalVisible((st) => !st), []);

  const handleToggleEditLayer = useCallback(() => {
    if (editedLayer) {
      setEditedLayer(undefined);
    } else {
      if (!activeLayer) {
        toasts.info(t('You_must_first_select_layer'));
      } else {
        setEditedLayer(activeLayer);
      }
    }
  }, [activeLayer, editedLayer, t, toasts]);

  const handleRemoveActive = useCallback(() => {
    if (!activeLayer) {
      toasts.info(t('You_must_first_select_layer'));
      return;
    }

    const remove = async () => {
      // We remove active layer
      const cs = RemoveLayerChangeset.create(activeLayer);
      await cs.execute();
      history.register(HistoryKey.Map, cs);

      // We activate last layer if any
      const map = geo.getMainMap();
      const layers = map.getLayers();
      if (layers.length) {
        map.setActiveLayer(layers[layers.length - 1]);
      }
    };

    remove().catch((err) => logger.error('Cannot remove layer', err));
  }, [activeLayer, geo, history, t, toasts]);

  const handleToggleVisibility = useCallback(
    (layerId: string) => {
      const map = geo.getMainMap();
      if (!activeLayer) {
        logger.error('Layer not found: ', layerId);
        return;
      }

      const toggle = async () => {
        const cs = new ToggleLayerVisibilityChangeset(map, activeLayer, !activeLayer.isVisible());
        await cs.execute();
        history.register(HistoryKey.Map, cs);
      };
      toggle().catch((err) => logger.error('Cannot toggle visibility of layer', err));
    },
    [activeLayer, geo, history]
  );

  const moveActiveLayer = useCallback(
    (move: number) => {
      if (!activeLayer) {
        toasts.info(t('You_must_first_select_layer'));
        return;
      }

      let position = layers.findIndex((l) => l.getId() && l.getId() === activeLayer.getId()) + move;
      if (position < 0) {
        position = 0;
      }
      if (position >= layers.length) {
        position = layers.length - 1;
      }

      const setLayerPosition = SetLayerPositionChangeset.create(activeLayer, position);
      setLayerPosition
        .execute()
        .then(() => history.register(HistoryKey.Map, setLayerPosition))
        .catch((err) => logger.error('Cannot set layer position', err));
    },
    [activeLayer, history, layers, t, toasts]
  );

  const handleLayerForward = useCallback(() => moveActiveLayer(+1), [moveActiveLayer]);
  const handleLayerBack = useCallback(() => moveActiveLayer(-1), [moveActiveLayer]);

  const handleShowData = useCallback(() => {
    const layerId = activeLayer?.getId();
    if (!layerId) {
      toasts.info(t('You_must_first_select_layer'));
      return;
    }

    showDataTableView(layerId);
  }, [activeLayer, showDataTableView, t, toasts]);

  return (
    <div className={`control-block ${Cls.layerControls}`}>
      <div className={Cls.titleRow}>
        {t('Layers')}

        <button onClick={handleToggleAddLayerModal} className={'btn btn-sm btn-secondary fw-bold'} data-cy={'add-layer'}>
          {t('Add_layer')}
          <FaIcon icon={IconDefs.faPlus} className={'ml-2'} />
        </button>
      </div>

      {/* List of layers */}
      <div className={`control-item ${Cls.layerList}`} data-cy="layers-list" ref={listRef}>
        {!layers.length && <div className={Cls.noLayers}>{t('No_layer')}</div>}
        {layers
          .map((layer) => {
            const metadata = layer.getMetadata();
            if (!metadata) {
              logger.error('Unsupported layer: ', layer);
              return undefined;
            }
            return <LayerListItem key={metadata.id} metadata={metadata} onSelect={handleSelection} onToggleVisibility={handleToggleVisibility} />;
          })
          .filter((elem) => !!elem)}
      </div>

      {/* Controls */}
      <div className={`control-item`}>
        <div className={Cls.buttonBar}>
          <WithTooltip title={t('Edit_layer')}>
            <button onClick={handleToggleEditLayer} className={'btn btn-link'} data-cy={'edit-layer'}>
              <FaIcon icon={IconDefs.faEdit} />
            </button>
          </WithTooltip>
          <WithTooltip title={t('Zoom_on_layer')}>
            <button onClick={handleZoom} className={'btn btn-link'}>
              <FaIcon icon={IconDefs.faSearchPlus} />
            </button>
          </WithTooltip>
          <WithTooltip title={t('Delete_active_layer')}>
            <button onClick={handleRemoveActive} className={'btn btn-link'} data-cy={'delete-layer'}>
              <FaIcon icon={IconDefs.faTrash} />
            </button>
          </WithTooltip>
          <WithTooltip title={t('Move_back')}>
            <button onClick={handleLayerBack} className={'btn btn-link'} title={t('Move_back')}>
              <FaIcon icon={IconDefs.faArrowUp} />
            </button>
          </WithTooltip>
          <WithTooltip title={t('Move_forward')}>
            <button onClick={handleLayerForward} className={'btn btn-link'}>
              <FaIcon icon={IconDefs.faArrowDown} />
            </button>
          </WithTooltip>
          <WithTooltip title={t('Show_data')}>
            <button onClick={handleShowData} disabled={!activeVectorLayer} className={'btn btn-link'}>
              <FaIcon icon={IconDefs.faTable} />
            </button>
          </WithTooltip>
        </div>
      </div>

      {/* Modals */}
      <AddLayerModal visible={addModalVisible} onHide={handleToggleAddLayerModal} />
      {editedLayer && <EditLayerModal layer={editedLayer} onHide={handleToggleEditLayer} />}
    </div>
  );
}
