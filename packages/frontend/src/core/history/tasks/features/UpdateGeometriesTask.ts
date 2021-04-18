import { Task } from '../../Task';
import Geometry from 'ol/geom/Geometry';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';

export interface UpdateItem {
  feature: FeatureWrapper;
  before: Geometry;
  after: Geometry;
}

export class UpdateGeometriesTask extends Task {
  constructor(private items: UpdateItem[]) {
    super();
  }

  public async undo(): Promise<void> {
    // As geometries are mutated, here we must clone it
    this.items.forEach((item) => {
      item.feature.unwrap().setGeometry(item.before.clone());
    });
  }

  public async redo(): Promise<void> {
    // As geometries are mutated, here we must clone it
    this.items.forEach((item) => {
      item.feature.unwrap().setGeometry(item.after.clone());
    });
  }
}
