import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '../../core/utils/Logger';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import { Extent } from 'ol/extent';
import './LayerSelector.scss';

const logger = Logger.get('LayerSelector.tsx', 'debug');

interface Props {
  layers: BaseLayer[];
}

interface State {
  selected?: BaseLayer;
}

class LayerSelector extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const items = this.props.layers.map((layer) => {
      const metadata = this.services.map.getMetadataFromLayer(layer);
      const selectedClass = this.state.selected === layer ? 'selected' : '';
      return (
        <div key={metadata.id} onClick={() => this.onLayerSelected(layer)} className={`list-item ${selectedClass}`}>
          - {metadata.name}
        </div>
      );
    });

    let message: string | undefined;
    if (!items || !items.length) {
      message = 'Aucune couche';
    }
    return (
      <div className={'abc-layer-selector d-flex flex-column'}>
        <div>Couches:</div>
        <div className={'layer-list'}>
          {items}
          {message}
        </div>
        <div className={'controls d-flex flex-column'}>
          <button onClick={this.zoomToSelectedLayer} className={'btn btn-outline-primary'}>
            Zoom
          </button>
          <button onClick={this.newOsmLayer} className={'btn btn-outline-primary'}>
            + Couche OSM
          </button>
          <button onClick={this.newVectorLayer} className={'btn btn-outline-primary'}>
            + Couche vectorielle
          </button>
          <button onClick={this.resetLayers} className={'btn btn-outline-primary'}>
            Tout supprimer
          </button>
          <button onClick={this.toggleLayerVisibility} className={'btn btn-outline-primary'}>
            Visibilité
          </button>
        </div>
      </div>
    );
  }

  private onLayerSelected = (layer: BaseLayer) => {
    this.setState((st) => ({ ...st, selected: layer }));
  };

  private zoomToSelectedLayer = () => {
    const selected = this.state.selected;
    if (!selected) {
      this.services.toasts.info("Vous devez d'abord sélectionner une couche");
      return logger.error('No layer selected');
    }

    const map = this.services.map.getMainMap();
    if (!map) {
      return logger.error('Map not ready');
    }

    let extent: Extent | undefined;
    if (selected instanceof VectorLayer) {
      extent = selected.getSource().getExtent();
    }

    if (!extent) {
      this.services.toasts.info('Impossible de zoomer sur cette couche');
      return logger.error('Layer does not have an extent');
    }

    map.getView().fit(extent);
  };

  private newOsmLayer = () => {
    const map = this.services.map.getMainMap();
    if (!map) {
      return logger.error('Map not ready');
    }

    const layer = this.services.map.newOsmLayer();
    map.addLayer(layer);
  };

  private newVectorLayer = () => {
    const map = this.services.map.getMainMap();
    if (!map) {
      return logger.error('Map not ready');
    }

    const layer = this.services.map.newVectorLayer();
    map.addLayer(layer);
  };

  private resetLayers = () => {
    const map = this.services.map.getMainMap();
    if (!map) {
      return logger.error('Map not ready');
    }

    map.getLayers().clear();
  };

  private toggleLayerVisibility = () => {
    const selected = this.state.selected;
    if (!selected) {
      return logger.error('No layer selected');
    }

    selected.setVisible(!selected.getVisible());
  };
}

export default LayerSelector;
