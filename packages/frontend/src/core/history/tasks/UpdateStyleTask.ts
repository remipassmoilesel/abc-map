import { Task } from '../Task';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { VectorStyles } from '../../geo/style/VectorStyles';
import { AbcStyleProperties } from '../../geo/style/AbcStyleProperties';

export interface UpdateStyleItem {
  before: AbcStyleProperties;
  after: AbcStyleProperties;
  feature: Feature<Geometry>;
}

export class UpdateStyleTask extends Task {
  constructor(private items: UpdateStyleItem[]) {
    super();
  }

  public async undo(): Promise<void> {
    this.items.forEach((item) => {
      VectorStyles.setProperties(item.feature, item.before);
    });
  }

  public async redo(): Promise<void> {
    this.items.forEach((item) => {
      VectorStyles.setProperties(item.feature, item.after);
    });
  }
}
