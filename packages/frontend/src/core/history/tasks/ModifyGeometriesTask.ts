import { Task } from '../Task';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';

export interface ModificationItem {
  feature: Feature<Geometry>;
  before: Geometry;
  after: Geometry;
}

export class ModifyGeometriesTask extends Task {
  constructor(private items: ModificationItem[]) {
    super();
  }

  public async undo(): Promise<void> {
    // As geometries are mutated, here we must clone it
    this.items.forEach((item) => {
      item.feature.setGeometry(item.before.clone());
    });
  }

  public async redo(): Promise<void> {
    // As geometries are mutated, here we must clone it
    this.items.forEach((item) => {
      item.feature.setGeometry(item.after.clone());
    });
  }
}
