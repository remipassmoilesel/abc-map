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
import { RemoveLayerTask } from '../../../core/history/tasks/layers/RemoveLayerTask';
import { HistoryKey } from '../../../core/history/HistoryKey';
import LayerListItem from './list-item/LayerListItem';
import AddLayerModal from './add-layer-modal/AddLayerModal';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { ServiceProps, withServices } from '../../../core/withServices';
import EditLayerModal from './edit-layer-modal/EditLayerModal';
import Cls from './LayerControls.module.scss';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('LayerControls.tsx', 'debug');

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
  constructor(props: Props) {
    super(props);
    this.state = { addModalVisible: false };
  }

  public render(): ReactNode {
    const addModalVisible = this.state.addModalVisible;
    const editLayer = this.state.editLayer;
    const items = this.getItems();

    return (
      <div className={`control-block ${Cls.layerControls}`}>
        <div className={'control-item'}>{t('Layers')}</div>
        <div className={`control-item ${Cls.layerList}`} data-cy="layers-list">
          {items}
          {!items.length && <div className={Cls.noLayers}>{t('No_layer')}</div>}
        </div>
        <div className={`control-item`}>
          <div className={`${Cls.row} ${Cls.smallButtons}`}>
            <button onClick={this.handleEditLayer} className={'btn btn-link'} title={t('Edit_layer')} data-cy={'edit-layer'}>
              <i className={'fa fa-edit'} />
            </button>
            <button onClick={this.handleToggleVisibility} className={'btn btn-link'} title={t('Change_visibility')}>
              <i className={'fa fa-eye'} />
            </button>
            <button onClick={this.handleZoom} className={'btn btn-link'} title={t('Zoom_on_layer')}>
              <i className={'fa fa-search-plus'} />
            </button>
            <button onClick={this.handleRemoveActive} className={'btn btn-link'} title={t('Delete_active_layer')} data-cy={'delete-layer'}>
              <i className={'fa fa-trash'} />
            </button>
            <button onClick={this.handleLayerBack} className={'btn btn-link'} title={t('Move_back')}>
              <i className={'fa fa-arrow-up'} />
            </button>
            <button onClick={this.handleLayerForward} className={'btn btn-link'} title={t('Move_forward')}>
              <i className={'fa fa-arrow-down'} />
            </button>
          </div>
          <div className={Cls.row}>
            <button onClick={this.handleAddLayer} className={'btn btn-link'} title={'Nouvelle couche'} data-cy={'add-layer'}>
              <i className={'fa fa-plus mr-2'} /> {t('New_layer')}
            </button>
          </div>
        </div>
        <AddLayerModal visible={addModalVisible} onHide={this.handleAddLayerModalClosed} />
        {editLayer && <EditLayerModal layer={editLayer} onHide={this.handleEditLayerClosed} />}
      </div>
    );
  }

  private getItems(): ReactNode[] {
    return this.props.layers
      .map((layer) => {
        const metadata = layer.getMetadata();
        if (!metadata) {
          return undefined;
        }
        return <LayerListItem key={metadata.id} metadata={metadata} onClick={this.handleSelection} />;
      })
      .filter((elem) => !!elem);
  }

  private handleSelection = (layerId: string) => {
    const { geo } = this.props.services;

    geo.getMainMap().setActiveLayerById(layerId);
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

    // We remove active layer
    map.removeLayer(layer);
    history.register(HistoryKey.Map, new RemoveLayerTask(map, layer));

    // We activate last layer if any
    const layers = map.getLayers();
    if (layers.length) {
      map.setActiveLayer(layers[layers.length - 1]);
    }
  };

  private handleToggleVisibility = () => {
    const { toasts, geo } = this.props.services;

    const map = geo.getMainMap();
    const active = map.getActiveLayer();
    if (!active) {
      toasts.info(t('You_must_first_select_layer'));
      logger.error('No layer selected');
      return;
    }

    map.setLayerVisible(active, !active.isVisible());
  };

  private handleLayerForward = () => {
    this.moveLayer(+1);
  };

  private handleLayerBack = () => {
    this.moveLayer(-1);
  };

  private moveLayer = (move: number) => {
    const { toasts, geo } = this.props.services;

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

    map.removeLayer(active);
    map.addLayer(active, position);
  };
}

export default withTranslation()(withServices(LayerControls));
