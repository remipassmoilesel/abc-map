import { Task } from '../../Task';
import VectorSource from 'ol/source/Vector';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';

export class AddFeaturesTask extends Task {
  constructor(public readonly source: VectorSource, public readonly features: FeatureWrapper[]) {
    super();
  }

  public async undo(): Promise<void> {
    this.features.forEach((feat) => this.source.removeFeature(feat.unwrap()));
  }

  public async redo(): Promise<void> {
    this.features.forEach((feat) => this.source.addFeature(feat.unwrap()));
  }
}
