import { Task } from '../Task';
import { ManagedMap } from '../../geo/map/ManagedMap';
import BaseLayer from 'ol/layer/Base';

export class AddLayerTask extends Task {
  constructor(private map: ManagedMap, private layer: BaseLayer) {
    super();
  }

  public async undo(): Promise<void> {
    this.map.removeLayer(this.layer);

    // We activate the last layer
    const layers = this.map.getLayers();
    if (layers.length) {
      this.map.setActiveLayer(layers[layers.length - 1]);
    }
  }

  public async redo(): Promise<void> {
    this.map.addLayer(this.layer);
    this.map.setActiveLayer(this.layer);
  }
}
