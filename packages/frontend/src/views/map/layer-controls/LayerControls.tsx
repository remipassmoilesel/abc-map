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

import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import { Extent, getArea } from 'ol/extent';
import { RemoveLayerChangeset } from '../../../core/history/changesets/layers/RemoveLayerChangeset';
import { HistoryKey } from '../../../core/history/HistoryKey';
import LayerListItem from './list-item/LayerListItem';
import AddLayerModal from './add-layer-modal/AddLayerModal';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { ServiceProps, withServices } from '../../../core/withServices';
import EditLayerModal from './edit-layer-modal/EditLayerModal';
import Cls from './LayerControls.module.scss';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { WithTooltip } from '../../../components/with-tooltip/WithTooltip';
import isEqual from 'lodash/isEqual';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { ToggleLayerVisibilityChangeset } from '../../../core/history/changesets/layers/ToggleLayerVisibilityChangeset';
import { SetActiveLayerChangeset } from '../../../core/history/changesets/layers/SetActiveLayerChangeset';
import { SetLayerPositionChangeset } from '../../../core/history/changesets/layers/SetLayerPositionChangeset';

const logger = Logger.get('LayerControls.tsx');

interface LocalProps {
  layers: LayerWrapper[];
}

interface State {
  editLayer?: LayerWrapper;
  addModalVisible: boolean;
}

declare type Props = LocalProps & ServiceProps;

const t = prefixedTranslation('MapView:LayerControls.');

class LayerControls extends Component<Props, State> {
  private listRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = { addModalVisible: false };
  }

  public render(): ReactNode {
    const addModalVisible = this.state.addModalVisible;
    const editLayer = this.state.editLayer;
    const layers = this.props.layers;

    return (
      <div className={`control-block ${Cls.layerControls}`}>
        <div className={Cls.titleRow}>
          {t('Layers')}

          <button onClick={this.handleAddLayer} className={'btn btn-sm btn-secondary fw-bold'} data-cy={'add-layer'}>
            {t('Add_layer')}
            <FaIcon icon={IconDefs.faPlus} className={'ml-2'} />
          </button>
        </div>

        {/* List of layers */}
        <div className={`control-item ${Cls.layerList}`} data-cy="layers-list" ref={this.listRef}>
          {!layers.length && <div className={Cls.noLayers}>{t('No_layer')}</div>}
          {layers
            .map((layer) => {
              const metadata = layer.getMetadata();
              if (!metadata) {
                logger.error('Unsupported layer: ', layer);
                return undefined;
              }
              return <LayerListItem key={metadata.id} metadata={metadata} onSelect={this.handleSelection} onToggleVisibility={this.handleToggleVisibility} />;
            })
            .filter((elem) => !!elem)}
        </div>

        {/* Controls */}
        <div className={`control-item`}>
          <div className={Cls.buttonBar}>
            <WithTooltip title={t('Edit_layer')}>
              <button onClick={this.handleEditLayer} className={'btn btn-link'} data-cy={'edit-layer'}>
                <FaIcon icon={IconDefs.faEdit} />
              </button>
            </WithTooltip>
            <WithTooltip title={t('Zoom_on_layer')}>
              <button onClick={this.handleZoom} className={'btn btn-link'}>
                <FaIcon icon={IconDefs.faSearchPlus} />
              </button>
            </WithTooltip>
            <WithTooltip title={t('Delete_active_layer')}>
              <button onClick={this.handleRemoveActive} className={'btn btn-link'} data-cy={'delete-layer'}>
                <FaIcon icon={IconDefs.faTrash} />
              </button>
            </WithTooltip>
            <WithTooltip title={t('Move_back')}>
              <button onClick={this.handleLayerBack} className={'btn btn-link'} title={t('Move_back')}>
                <FaIcon icon={IconDefs.faArrowUp} />
              </button>
            </WithTooltip>
            <WithTooltip title={t('Move_forward')}>
              <button onClick={this.handleLayerForward} className={'btn btn-link'}>
                <FaIcon icon={IconDefs.faArrowDown} />
              </button>
            </WithTooltip>
          </div>
        </div>

        {/* Modals */}
        <AddLayerModal visible={addModalVisible} onHide={this.handleAddLayerModalClosed} />
        {editLayer && <EditLayerModal layer={editLayer} onHide={this.handleEditLayerClosed} />}
      </div>
    );
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const previousIds = prevProps.layers.map((lay) => lay.getId());
    const layerIds = this.props.layers.map((lay) => lay.getId());
    if (!isEqual(previousIds, layerIds)) {
      // We scroll to bottom of list if layer list change
      const div = this.listRef.current;
      if (div) {
        div.scrollTop = div.scrollHeight;
      }
    }
  }

  private handleSelection = (layerId: string) => {
    const { geo, toasts, history } = this.props.services;

    const map = geo.getMainMap();

    if (map.getActiveLayer()?.getId() === layerId) {
      return;
    }

    const layer = map.getLayers().find((lay) => lay.getId() === layerId);

    if (!layer) {
      logger.error('Layer not found: ' + layerId);
      toasts.genericError();
      return;
    }

    // We set it active
    const setActiveLayer = SetActiveLayerChangeset.create(layer);
    setActiveLayer
      .apply()
      // We register action in history
      .then(() => history.register(HistoryKey.Map, setActiveLayer))
      .catch((err) => logger.error('Cannot set layer active', err));
  };

  private handleZoom = () => {
    const { toasts, geo } = this.props.services;

    const layer = geo.getMainMap().getActiveLayer();
    if (!layer) {
      toasts.info(t('You_must_first_select_layer'));
      logger.error('No layer selected');
      return;
    }

    let extent: Extent | undefined;
    if (layer.isVector()) {
      extent = layer.getSource().getExtent();
    } else {
      extent = layer.unwrap().getExtent();
    }

    if (!extent || !getArea(extent)) {
      toasts.info(t('Unable_to_zoom'));
      logger.error('Layer does not have an extent, or extent is invalid');
      return;
    }

    geo.getMainMap().unwrap().getView().fit(extent);
  };

  private handleAddLayer = () => {
    this.setState({ addModalVisible: true });
  };

  private handleAddLayerModalClosed = () => {
    this.setState({ addModalVisible: false });
  };

  private handleEditLayerClosed = () => {
    this.setState({ editLayer: undefined });
  };

  private handleEditLayer = () => {
    const { toasts, geo } = this.props.services;

    const map = geo.getMainMap();
    const active = map.getActiveLayer();
    if (!active) {
      toasts.info(t('You_must_first_select_layer'));
      return;
    }

    this.setState({ editLayer: active });
  };

  private handleRemoveActive = () => {
    const { toasts, geo, history } = this.props.services;

    const map = geo.getMainMap();
    const layer = map.getActiveLayer();
    if (!layer) {
      toasts.info(t('You_must_first_select_layer'));
      return;
    }

    const remove = async () => {
      // We remove active layer
      const cs = new RemoveLayerChangeset(map, layer);
      await cs.apply();
      history.register(HistoryKey.Map, cs);

      // We activate last layer if any
      const layers = map.getLayers();
      if (layers.length) {
        map.setActiveLayer(layers[layers.length - 1]);
      }
    };

    remove().catch((err) => logger.error('Cannot remove layer', err));
  };

  private handleToggleVisibility = (layerId: string) => {
    const { geo, history } = this.props.services;

    const map = geo.getMainMap();
    const layer = map.getLayers().find((lay) => lay.getId() === layerId);
    if (!layer) {
      logger.error('Layer not found: ', layerId);
      return;
    }

    const toggle = async () => {
      const cs = new ToggleLayerVisibilityChangeset(map, layer, !layer.isVisible());
      await cs.apply();
      history.register(HistoryKey.Map, cs);
    };
    toggle().catch((err) => logger.error('Cannot toggle visibility of layer', err));
  };

  private handleLayerForward = () => {
    this.moveLayer(+1);
  };

  private handleLayerBack = () => {
    this.moveLayer(-1);
  };

  private moveLayer = (move: number) => {
    const { toasts, geo, history } = this.props.services;

    const map = geo.getMainMap();
    const active = map.getActiveLayer();
    if (!active) {
      toasts.info(t('You_must_first_select_layer'));
      return;
    }

    const layers = map.getLayers();
    let position = layers.findIndex((l) => l.getId() && l.getId() === active.getId()) + move;

    if (position < 0) {
      position = 0;
    }
    if (position >= layers.length) {
      position = layers.length - 1;
    }

    const setLayerPosition = SetLayerPositionChangeset.create(active, position);

    setLayerPosition
      .apply()
      .then(() => history.register(HistoryKey.Map, setLayerPosition))
      .catch((err) => logger.error('Cannot set layer position', err));
  };
}

export default withTranslation()(withServices(LayerControls));
