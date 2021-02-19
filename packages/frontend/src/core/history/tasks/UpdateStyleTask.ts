import { Task } from '../Task';
import { AbcStyleProperties } from '../../geo/style/AbcStyleProperties';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';

export interface UpdateStyleItem {
  before: AbcStyleProperties;
  after: AbcStyleProperties;
  feature: FeatureWrapper;
}

export class UpdateStyleTask extends Task {
  constructor(private items: UpdateStyleItem[]) {
    super();
  }

  public async undo(): Promise<void> {
    this.items.forEach((item) => {
      item.feature.setStyle(item.before);
    });
  }

  public async redo(): Promise<void> {
    this.items.forEach((item) => {
      item.feature.setStyle(item.after);
    });
  }
}
