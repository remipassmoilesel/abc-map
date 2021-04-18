import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import BaseEvent from 'ol/events/Event';

export enum TextEvent {
  Start = 'text-start',
  Changed = 'text-changed',
  End = 'text-end',
}

export class TextStart extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>, public readonly text: string) {
    super(TextEvent.Start);
  }
}

export class TextChanged extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>, public readonly text: string) {
    super(TextEvent.Changed);
  }
}

export class TextEnd extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>, public readonly text: string) {
    super(TextEvent.End);
  }
}
