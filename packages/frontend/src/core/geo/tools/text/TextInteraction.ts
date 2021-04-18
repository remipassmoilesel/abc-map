import { Logger } from '@abc-map/frontend-shared';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import { TextChanged, TextEnd, TextStart } from './TextInteractionEvents';
import VectorSource from 'ol/source/Vector';
import { findFeatureUnderCursor } from '../common/findFeatureUnderCursor';
import { Interaction } from 'ol/interaction';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { notShiftKey } from '../../map/interactions';

const logger = Logger.get('TextInteraction.ts');

export interface Options {
  source: VectorSource;
}

export class TextInteraction extends Interaction {
  private readonly source: VectorSource;

  constructor(private options: Options) {
    super();
    this.source = options.source;
  }

  /**
   * Return true to continue event dispatch
   * @param event
   */
  public handleEvent(event: MapBrowserEvent<UIEvent>): boolean {
    if (MapBrowserEventType.POINTERDOWN === event.type && notShiftKey(event)) {
      return this.handlePointerDown(event);
    }
    return true;
  }

  protected handlePointerDown(event: MapBrowserEvent<UIEvent>): boolean {
    const feature = findFeatureUnderCursor(event, this.source);
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
