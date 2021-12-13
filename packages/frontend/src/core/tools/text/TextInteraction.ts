/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { Logger } from '@abc-map/shared';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { TextChanged, TextEnd, TextEvent, TextStart } from './TextInteractionEvents';
import VectorSource from 'ol/source/Vector';
import { findFeatureNearCursor } from '../common/helpers/findFeatureNearCursor';
import { Interaction } from 'ol/interaction';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { withMainButton } from '../common/helpers/common-conditions';
import { noModifierKeys } from 'ol/events/condition';
import Geometry from 'ol/geom/Geometry';

const logger = Logger.get('TextInteraction.ts');

export interface Options {
  source: VectorSource<Geometry>;
}

export class TextInteraction extends Interaction {
  private readonly source: VectorSource<Geometry>;

  constructor(private options: Options) {
    super();
    this.source = options.source;
  }

  // FIXME These methods was created because of errors in openlayers typings,
  // FIXME which does not allow other events than 'change' or 'error' on interactions 🤷
  public customOn(type: TextEvent.Start, handler: (ev: TextStart) => void): void;
  public customOn(type: TextEvent.Changed, handler: (ev: TextChanged) => void): void;
  public customOn(type: TextEvent.End, handler: (ev: TextEnd) => void): void;
  public customOn(type: TextEvent, handler: (ev: TextStart | TextChanged | TextEnd) => void): void {
    this.on(type as any, handler as any);
  }

  /**
   * Return true to continue event dispatch
   * @param event
   */
  public handleEvent(event: MapBrowserEvent<MouseEvent>): boolean {
    if (!withMainButton(event) || !noModifierKeys(event)) {
      return true;
    }

    if (MapBrowserEventType.POINTERDOWN === event.type) {
      return this.handlePointerDown(event);
    }
    return true;
  }

  protected handlePointerDown(event: MapBrowserEvent<MouseEvent>): boolean {
    const feature = findFeatureNearCursor(event, this.source);
    if (!feature) {
      return false;
    }

    const map = event.map.getTarget();
    if (!map || !(map instanceof HTMLDivElement)) {
      logger.error('Invalid map target: ', map);
      return false;
    }

    const x = map.getBoundingClientRect().x + event.pixel[0];
    const y = map.getBoundingClientRect().y + event.pixel[1];

    const text = FeatureWrapper.from(feature).getText() || '';
    this.dispatchEvent(new TextStart(feature, text));

    this.showTextBox(
      text,
      x,
      y,
      (text) => this.dispatchEvent(new TextChanged(feature, text)),
      (text) => this.dispatchEvent(new TextEnd(feature, text))
    );

    return false;
  }

  private showTextBox(value: string, x: number, y: number, onChange: (text: string) => void, onClose: (text: string) => void) {
    const backdrop = document.createElement('div');
    const inputBox = document.createElement('div');
    const textarea = document.createElement('textarea');
    const buttonBox = document.createElement('div');
    const button = document.createElement('button');

    const handleValidation = () => {
      document.body.removeChild(backdrop);
      document.body.removeChild(inputBox);
      onClose(textarea.value);
    };

    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.right = '0';
    backdrop.style.left = '0';
    backdrop.style.bottom = '0';
    backdrop.dataset['cy'] = 'text-box-backdrop';
    backdrop.addEventListener('click', handleValidation);
    backdrop.dataset['testid'] = 'backdrop';

    inputBox.style.display = 'flex';
    inputBox.style.justifyContent = 'center';
    inputBox.style.alignItems = 'flex-start';
    inputBox.style.borderRadius = '0.4rem';
    inputBox.style.position = 'absolute';
    inputBox.style.left = x + 'px';
    inputBox.style.top = y - 30 + 'px';

    textarea.cols = 25;
    textarea.rows = 2;
    textarea.value = value;
    textarea.dataset['cy'] = 'text-box';
    textarea.className = 'form-control';
    textarea.oninput = () => onChange(textarea.value);
    textarea.dataset['testid'] = 'textarea';

    button.type = 'button';
    button.className = 'btn btn-outline-primary abc-text-box-button';
    button.onclick = handleValidation;
    button.innerText = 'Ok';
    button.dataset['testid'] = 'button';

    inputBox.append(textarea);
    buttonBox.append(button);
    inputBox.append(buttonBox);
    document.body.append(backdrop);
    document.body.append(inputBox);

    // We must delay focus otherwise it append before element setup
    setTimeout(() => textarea.focus(), 100);
  }
}
