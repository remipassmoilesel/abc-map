import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { Logger } from '../../../core/utils/Logger';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import { Extent, getArea } from 'ol/extent';
import { RemoveLayerTask } from '../../../core/history/tasks/RemoveLayerTask';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { ModalStatus } from '../../../core/ui/Modals.types';
import { LayerFactory } from '../../../core/map/LayerFactory';
import LayerListItem from './item/LayerListItem';
import NewLayerModal from './new-layer-modal/NewLayerModal';
import './LayerSelector.scss';

const logger = Logger.get('LayerSelector.tsx', 'debug');

interface Props {
  /**
   * Layers are passed here in order to trigger changes on layers changes
   */
  layers: BaseLayer[];
}

interface State {
  addModalVisible: boolean;
}

class LayerSelector extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      addModalVisible: false,
    };
  }

  public render(): ReactNode {
    const items = this.getItems();
    let message: string | undefined;
    if (!items || !items.length) {
      message = 'Aucune couche';
    }
    return (
      <div className={'control-block abc-layer-selector d-flex flex-column'}>
        <div className={'control-item'}>Couches</div>
        <div className={'control-item layer-list'} data-cy="layers-list">
          {items}
          {message}
        </div>
        <div className={'control-item controls'}>
          <button onClick={this.addLayerModal} className={'btn btn-outline-primary'} title={'Ajouter une couche'} data-cy={'add-layer'}>
            <i className={'fa fa-plus'} />
          </button>
          <button onClick={this.renameLayerModal} className={'btn btn-outline-primary'} title={'Renommer la couche'} data-cy={'rename-layer'}>
            <i className={'fa fa-edit'} />
          </button>
          <button onClick={this.removeActiveLayer} className={'btn btn-outline-primary'} title={'Supprimer la couche active'} data-cy={'delete-layer'}>
            <i className={'fa fa-trash'} />
          </button>
          <button onClick={this.zoomToSelectedLayer} className={'btn btn-outline-primary'} title={'Zoom sur la couche'}>
            <i className={'fa fa-search-plus'} />
          </button>
          <button onClick={this.toggleLayerVisibility} className={'btn btn-outline-primary'} title={'Changer la visibilité'}>
            <i className={'fa fa-eye'} />
          </button>
        </div>
        <NewLayerModal visible={this.state.addModalVisible} onHide={this.hideAddModal} />
      </div>
    );
  }

  private getItems(): ReactNode[] {
    return this.props.layers
      .map((layer) => {
        const metadata = this.services.geo.getMetadataFromLayer(layer);
        if (!metadata) {
          return undefined;
        }
        return <LayerListItem key={metadata.id} metadata={metadata} onClick={this.onLayerSelected} />;
      })
      .filter((elem) => !!elem);
  }

  private onLayerSelected = (layerId: string) => {
    this.services.geo.getMainMap().setActiveLayerById(layerId);
  };

  private zoomToSelectedLayer = () => {
    const selected = this.services.geo.getMainMap().getActiveLayer();
    if (!selected) {
      this.services.ui.toasts.info("Vous devez d'abord sélectionner une couche");
      return logger.error('No layer selected');
    }

    let extent: Extent | undefined;
    if (selected instanceof VectorLayer) {
      extent = selected.getSource().getExtent();
    }

    if (!extent || !getArea(extent)) {
      this.services.ui.toasts.info('Impossible de zoomer sur cette couche');
      return logger.error('Layer does not have an extent, or extent is invalid');
    }

    this.services.geo.getMainMap().getInternal().getView().fit(extent);
  };

  private addLayerModal = () => {
    this.setState({ addModalVisible: true });
  };

  private hideAddModal = () => {
    this.setState({ addModalVisible: false });
  };

  private renameLayerModal = () => {
    const map = this.services.geo.getMainMap();
    const active = map.getActiveLayer();
    const metadata = active && LayerFactory.getMetadataFromLayer(active);
    if (!active || !metadata) {
      return this.services.ui.toasts.info("Vous devez d'abord sélectionner une couche");
    }

    this.services.ui.modals
      .renameModal('Renommer', 'Renommer la couche', metadata.name)
      .then((res) => {
        if (ModalStatus.Confirmed) {
          map.renameLayer(active, res.value);
        }
      })
      .catch((err) => {
        logger.error(err);
        this.services.ui.toasts.genericError();
      });
  };

  private removeActiveLayer = () => {
    const map = this.services.geo.getMainMap();
    const layer = map.getActiveLayer();
    if (!layer) {
      this.services.ui.toasts.info("Vous devez d'abord sélectionner une couche");
      return;
    }

    // We remove active layer
    map.removeLayer(layer);
    this.services.history.register(HistoryKey.Map, new RemoveLayerTask(map, layer));

    // We activate last layer if any
    const layers = map.getLayers();
    if (layers.length) {
      map.setActiveLayer(layers[layers.length - 1]);
    }
  };

  private toggleLayerVisibility = () => {
    const map = this.services.geo.getMainMap();
    const active = map.getActiveLayer();
    if (!active) {
      this.services.ui.toasts.info("Vous devez d'abord sélectionner une couche");
      return logger.error('No layer selected');
    }

    map.setLayerVisible(active, !active.getVisible());
  };
}

export default LayerSelector;
