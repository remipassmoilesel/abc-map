import { Logger } from '../../../utils/Logger';
import PointerInteraction from 'ol/interaction/Pointer';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { containsCoordinate } from 'ol/extent';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import BaseEvent from 'ol/events/Event';

const logger = Logger.get('TextInteraction.ts');

export interface Options {
  features: Feature<Geometry>[];
}

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

export class TextInteraction extends PointerInteraction {
  private readonly features: Feature<Geometry>[];
  private tolerance = 10;

  constructor(private options: Options) {
    super();
    this.features = options.features;
  }

  protected handleDownEvent(event: MapBrowserEvent<UIEvent>): boolean {
    const coord = event.coordinate;
    const resolution = event.map.getView().getResolution() || 1;
    const tolerance = this.tolerance * resolution;

    // we try to find a feature close to event
    const feature = this.features.find((feat) => {
      const extent = feat.getGeometry()?.getExtent();
      if (!extent) {
        return false;
      }
      const inExtent = containsCoordinate(extent, coord);
      const closestPoint = feat.getGeometry()?.getClosestPoint(coord);
      const closeTo = closestPoint && Math.abs(closestPoint[0] - coord[0]) < tolerance && Math.abs(closestPoint[1] - coord[1]) < tolerance;
      return inExtent || closeTo;
    });

    if (!feature) {
      return false;
    }

    const map = event.map.getTarget() as HTMLDivElement;
    const x = map.getBoundingClientRect().x + event.pixel[0];
    const y = map.getBoundingClientRect().y + event.pixel[1];

    const text = FeatureWrapper.from(feature).getText() || '';
    this.dispatchEvent(new TextStart(feature, text));

    this.showTextBox(
      text,
      x,
      y,
      (text) => {
        this.dispatchEvent(new TextChanged(feature, text));
      },
      (text) => {
        this.dispatchEvent(new TextEnd(feature, text));
      }
    );

    return false;
  }

  private showTextBox(value: string, x: number, y: number, onChange: (text: string) => void, onClose: (text: string) => void) {
    const body = document.querySelector('body');
    if (!body) {
      logger.error('Cannot show text box');
      return;
    }

    const backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.right = '0';
    backdrop.style.left = '0';
    backdrop.style.bottom = '0';
    backdrop.dataset['cy'] = 'text-box-backdrop';
    body.append(backdrop);

    const box = document.createElement('input');
    box.type = 'text';
    box.value = value;
    box.dataset['cy'] = 'text-box';
    box.className = 'form-control';
    box.style.position = 'absolute';
    box.style.left = x + 'px';
    box.style.top = y - 30 + 'px';
    box.style.width = `200px`;
    body.append(box);

    backdrop.addEventListener('click', () => {
      body.removeChild(backdrop);
      body.removeChild(box);
      onClose(box.value);
    });

    box.oninput = () => {
      onChange(box.value);
    };
  }
}
