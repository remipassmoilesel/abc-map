import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { Extent, getArea } from 'ol/extent';
import { RemoveLayerTask } from '../../../core/history/tasks/layers/RemoveLayerTask';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { ModalStatus } from '../../../core/ui/Modals.types';
import LayerListItem from './item/LayerListItem';
import AddLayerModal from './add-layer-modal/AddLayerModal';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { ServiceProps, withServices } from '../../../core/withServices';
import Cls from './LayerControls.module.scss';

const logger = Logger.get('LayerControls.tsx', 'debug');

interface LocalProps {
  layers: LayerWrapper[];
}

interface State {
  addModalVisible: boolean;
}

declare type Props = LocalProps & ServiceProps;

export class LayerControls extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      addModalVisible: false,
    };
  }

  public render(): ReactNode {
    const items = this.getItems();
    let message: ReactNode | undefined;
    if (!items || !items.length) {
      message = <div className={Cls.noLayers}>Aucune couche</div>;
    }

    return (
      <div className={`control-block ${Cls.layerControls}`}>
        <div className={'control-item'}>Couches</div>
        <div className={`control-item ${Cls.layerList}`} data-cy="layers-list">
          {items}
          {message}
        </div>
        <div className={`control-item ${Cls.controls}`}>
          <button onClick={this.handleAddLayer} className={'btn btn-outline-primary'} title={'Ajouter une couche'} data-cy={'add-layer'}>
            <i className={'fa fa-plus'} />
          </button>
          <button onClick={this.handleRename} className={'btn btn-outline-primary'} title={'Renommer la couche'} data-cy={'rename-layer'}>
            <i className={'fa fa-edit'} />
          </button>
          <button onClick={this.handleRemoveActive} className={'btn btn-outline-primary'} title={'Supprimer la couche active'} data-cy={'delete-layer'}>
            <i className={'fa fa-trash'} />
          </button>
          <button onClick={this.handleZoom} className={'btn btn-outline-primary'} title={'Zoom sur la couche'}>
            <i className={'fa fa-search-plus'} />
          </button>
          <button onClick={this.handleToggleVisibility} className={'btn btn-outline-primary'} title={'Changer la visibilité'}>
            <i className={'fa fa-eye'} />
          </button>
        </div>
        <AddLayerModal visible={this.state.addModalVisible} onHide={this.hideAddModal} />
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
      toasts.info("Vous devez d'abord sélectionner une couche");
      return logger.error('No layer selected');
    }

    let extent: Extent | undefined;
    if (layer.isVector()) {
      extent = layer.getSource().getExtent();
    } else {
      extent = layer.unwrap().getExtent();
    }

    if (!extent || !getArea(extent)) {
      toasts.info('Impossible de zoomer sur cette couche');
      return logger.error('Layer does not have an extent, or extent is invalid');
    }

    geo.getMainMap().unwrap().getView().fit(extent);
  };

  private handleAddLayer = () => {
    this.setState({ addModalVisible: true });
  };

  private hideAddModal = () => {
    this.setState({ addModalVisible: false });
  };

  private handleRename = () => {
    const { toasts, modals, geo } = this.props.services;

    const map = geo.getMainMap();
    const active = map.getActiveLayer();
    if (!active) {
      return toasts.info("Vous devez d'abord sélectionner une couche");
    }

    modals
      .renameModal('Renommer', 'Renommer la couche', active.getMetadata()?.name || 'Couche')
      .then((res) => {
        if (ModalStatus.Confirmed) {
          map.renameLayer(active, res.value);
        }
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };

  private handleRemoveActive = () => {
    const { toasts, geo, history } = this.props.services;

    const map = geo.getMainMap();
    const layer = map.getActiveLayer();
    if (!layer) {
      toasts.info("Vous devez d'abord sélectionner une couche");
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
      toasts.info("Vous devez d'abord sélectionner une couche");
      logger.error('No layer selected');
      return;
    }

    map.setLayerVisible(active, !active.isVisible());
  };
}

export default withServices(LayerControls);