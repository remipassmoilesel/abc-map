import BaseEvent from 'ol/events/Event';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';

export enum ToolEvent {
  FeatureCreated = 'feature-created',
  FeatureBeingCreated = 'feature-being-created',
  GeometryBeingUpdated = 'geometry-being-updated',
  GeometryUpdated = 'geometry-updated',
}

export class FeatureCreated extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>) {
    super(ToolEvent.FeatureCreated);
  }
}

export class FeatureBeingCreated extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>) {
    super(ToolEvent.FeatureBeingCreated);
  }
}

export class GeometryBeingUpdated extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>) {
    super(ToolEvent.GeometryBeingUpdated);
  }
}

export class GeometryUpdated extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>) {
    super(ToolEvent.GeometryUpdated);
  }
}
