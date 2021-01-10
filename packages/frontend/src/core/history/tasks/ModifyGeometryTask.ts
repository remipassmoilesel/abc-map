import { Task } from '../Task';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';

export class ModifyGeometryTask extends Task {
  constructor(private feature: Feature, private before: Geometry, private after: Geometry) {
    super();
  }

  public async undo(): Promise<void> {
    // As geometries are mutated, here we must clone it
    this.feature.setGeometry(this.before.clone());
  }

  public async redo(): Promise<void> {
    // As geometries are mutated, here we must clone it
    this.feature.setGeometry(this.after.clone());
  }
}
