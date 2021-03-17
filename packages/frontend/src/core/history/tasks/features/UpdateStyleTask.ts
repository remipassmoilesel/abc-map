import { Task } from '../../Task';
import { FeatureStyle } from '../../../geo/style/FeatureStyle';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';

export interface UpdateStyleItem {
  before: FeatureStyle;
  after: FeatureStyle;
  feature: FeatureWrapper;
}

export class UpdateStyleTask extends Task {
  constructor(private items: UpdateStyleItem[]) {
    super();
  }

  public async undo(): Promise<void> {
    this.items.forEach((item) => {
      item.feature.setStyleProperties(item.before);
    });
  }

  public async redo(): Promise<void> {
    this.items.forEach((item) => {
      item.feature.setStyleProperties(item.after);
    });
  }
}
