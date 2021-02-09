import { Task } from '../Task';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';

export class AddFeaturesTask extends Task {
  constructor(private source: VectorSource, private features: Feature<Geometry>[]) {
    super();
  }

  public async undo(): Promise<void> {
    this.features.forEach((feat) => this.source.removeFeature(feat));
  }

  public async redo(): Promise<void> {
    this.features.forEach((feat) => this.source.addFeature(feat));
  }
}
