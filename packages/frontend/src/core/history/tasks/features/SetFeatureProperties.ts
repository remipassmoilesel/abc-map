import { Task } from '../../Task';
import { FeatureWrapper, SimplePropertiesMap } from '../../../geo/features/FeatureWrapper';

export class SetFeatureProperties extends Task {
  constructor(private feature: FeatureWrapper, public readonly before: SimplePropertiesMap, public readonly after: SimplePropertiesMap) {
    super();
  }

  public async undo(): Promise<void> {
    const properties: SimplePropertiesMap = { ...this.before };
    this.feature.overwriteSimpleProperties(properties);
  }

  public async redo(): Promise<void> {
    const properties: SimplePropertiesMap = { ...this.after };
    this.feature.overwriteSimpleProperties(properties);
  }
}
