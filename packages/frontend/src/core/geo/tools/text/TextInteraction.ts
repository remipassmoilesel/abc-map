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

import { Logger } from '@abc-map/frontend-commons';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import { TextChanged, TextEnd, TextStart } from './TextInteractionEvents';
import VectorSource from 'ol/source/Vector';
import { findFeatureNearCursor } from '../common/findFeatureNearCursor';
import { Interaction } from 'ol/interaction';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { withMainButton, withShiftKey } from '../common/common-conditions';

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
    if (withShiftKey(event) || !withMainButton(event)) {
      return true;
    }

    if (MapBrowserEventType.POINTERDOWN === event.type) {
      return this.handlePointerDown(event);
    }
    return true;
  }

  protected handlePointerDown(event: MapBrowserEvent<UIEvent>): boolean {
    const feature = findFeatureNearCursor(event, this.source);
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
    const backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.right = '0';
    backdrop.style.left = '0';
    backdrop.style.bottom = '0';
    backdrop.dataset['cy'] = 'text-box-backdrop';
    document.body.append(backdrop);

    const box = document.createElement('input');
    box.type = 'text';
    box.value = value;
    box.dataset['cy'] = 'text-box';
    box.className = 'form-control';
    box.style.position = 'absolute';
    box.style.left = x + 'px';
    box.style.top = y - 30 + 'px';
    box.style.width = `200px`;
    document.body.append(box);

    backdrop.addEventListener('click', () => {
      document.body.removeChild(backdrop);
      document.body.removeChild(box);
      onClose(box.value);
    });

    box.oninput = () => {
      onChange(box.value);
    };
  }
}
