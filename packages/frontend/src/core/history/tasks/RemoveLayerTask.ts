import { Task } from '../Task';
import { MapWrapper } from '../../geo/map/MapWrapper';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';

export class RemoveLayerTask extends Task {
  constructor(private map: MapWrapper, private layer: LayerWrapper) {
    super();
  }

  public async undo(): Promise<void> {
    this.map.addLayer(this.layer);
    this.map.setActiveLayer(this.layer);
  }

  public async redo(): Promise<void> {
    this.map.removeLayer(this.layer);

    // We activate the last layer
    const layers = this.map.getLayers();
    if (layers.length) {
      this.map.setActiveLayer(layers[layers.length - 1]);
    }
  }
}
