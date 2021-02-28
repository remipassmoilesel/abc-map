import { Task } from '../Task';
import { MapWrapper } from '../../geo/map/MapWrapper';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';

export class AddLayersTask extends Task {
  constructor(private map: MapWrapper, private layers: LayerWrapper[]) {
    super();
  }

  public async undo(): Promise<void> {
    this.layers.forEach((lay) => this.map.removeLayer(lay));

    // We activate the last layer
    const layers = this.map.getLayers();
    if (layers.length) {
      this.map.setActiveLayer(layers[layers.length - 1]);
    }
  }

  public async redo(): Promise<void> {
    this.layers.forEach((lay) => this.map.addLayer(lay));

    // We activate the last layer
    const layers = this.map.getLayers();
    if (layers.length) {
      this.map.setActiveLayer(layers[layers.length - 1]);
    }
  }
}
