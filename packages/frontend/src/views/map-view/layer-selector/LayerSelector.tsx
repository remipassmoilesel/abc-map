import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { Logger } from '../../../core/utils/Logger';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import { Extent, getArea } from 'ol/extent';
import { ManagedMap } from '../../../core/map/ManagedMap';
import './LayerSelector.scss';

const logger = Logger.get('LayerSelector.tsx', 'debug');

interface Props {
  /**
   * Reference to the map to control, for side effects
   */
  map: ManagedMap;

  /**
   * Layers are passed here in order to trigger changes on layers changes
   */
  layers: BaseLayer[];
}

class LayerSelector extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const items = this.props.layers
      .map((layer) => {
        const metadata = this.services.geo.getMetadataFromLayer(layer);
        if (!metadata) {
          return undefined;
        }
        const selectedClass = metadata.active ? 'active' : '';
        return (
          <div key={metadata.id} onClick={() => this.onLayerSelected(metadata.id)} className={`list-item ${selectedClass}`}>
            - {metadata.name}
          </div>
        );
      })
      .filter((elem) => !!elem);

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
          <button onClick={this.zoomToSelectedLayer} className={'btn btn-outline-primary'} title={'Zoom'}>
            ZO
          </button>
          <button onClick={this.newOsmLayer} className={'btn btn-outline-primary'} title={'Ajouter une couche OSM'}>
            OSM
          </button>
          <button onClick={this.newVectorLayer} className={'btn btn-outline-primary'} title={'Ajouter une couche de formes'}>
            FOR
          </button>
          <button onClick={this.resetLayers} className={'btn btn-outline-primary'} title={'Tout supprimer'}>
            SUPPR
          </button>
          <button onClick={this.toggleLayerVisibility} className={'btn btn-outline-primary'} title={'Changer la visibilité'}>
            VIS
          </button>
        </div>
      </div>
    );
  }

  private onLayerSelected = (layerId: string) => {
    this.props.map.setActiveLayerById(layerId);
  };

  private zoomToSelectedLayer = () => {
    const selected = this.props.map.getActiveLayer();
    if (!selected) {
      this.services.toasts.info("Vous devez d'abord sélectionner une couche");
      return logger.error('No layer selected');
    }

    let extent: Extent | undefined;
    if (selected instanceof VectorLayer) {
      extent = selected.getSource().getExtent();
    }

    if (!extent || !getArea(extent)) {
      this.services.toasts.info('Impossible de zoomer sur cette couche');
      return logger.error('Layer does not have an extent, or extent is invalid');
    }

    this.props.map.getInternal().getView().fit(extent);
  };

  private newOsmLayer = () => {
    const layer = this.services.geo.newOsmLayer();
    this.props.map.addLayer(layer);
    this.props.map.setActiveLayer(layer);
  };

  private newVectorLayer = () => {
    const layer = this.services.geo.newVectorLayer();
    this.props.map.addLayer(layer);
    this.props.map.setActiveLayer(layer);
  };

  private resetLayers = () => {
    this.props.map.reset();
  };

  private toggleLayerVisibility = () => {
    const selected = this.props.map.getActiveLayer();
    if (!selected) {
      this.services.toasts.info("Vous devez d'abord sélectionner une couche");
      return logger.error('No layer selected');
    }

    selected.setVisible(!selected.getVisible());
  };
}

export default LayerSelector;
