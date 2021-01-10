import { Task } from '../Task';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';

export class AddFeatureTask extends Task {
  constructor(private source: VectorSource, private feature: Feature<Geometry>) {
    super();
  }

  public async undo(): Promise<void> {
    this.source.removeFeature(this.feature);
  }

  public async redo(): Promise<void> {
    this.source.addFeature(this.feature);
  }
}
