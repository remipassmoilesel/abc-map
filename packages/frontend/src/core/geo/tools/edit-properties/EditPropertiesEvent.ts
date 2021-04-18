import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import BaseEvent from 'ol/events/Event';

export enum EditPropertiesEvent {
  FeatureSelected = 'feature-selected',
}

export class FeatureSelected extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>) {
    super(EditPropertiesEvent.FeatureSelected);
  }
}
