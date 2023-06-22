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
import { Interaction } from 'ol/interaction';
import { FinishButton } from './FinishButton';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import Map from 'ol/Map';
import { getRemSize } from '../../../ui/getRemSize';

export const logger = Logger.get('FinishButton.ts');

export class FinishDrawingButton extends Interaction {
  private button: FinishButton | undefined;
  public onFinishDrawing?: () => void;

  constructor() {
    super(undefined);
  }

  public handleEvent(event: MapBrowserEvent<any>): boolean {
    if (event.type === MapBrowserEventType.POINTERDOWN) {
      const map = event?.map as Map | undefined;
      const mapTarget = map?.getTarget() as HTMLDivElement | undefined;
      if (!mapTarget || !(mapTarget instanceof HTMLDivElement)) {
        logger.error('Cannot show button: ', { map, mapTarget });
        return true;
      }

      const x = mapTarget.getBoundingClientRect().x + event?.pixel[0] + getRemSize() * 2;
      const y = mapTarget.getBoundingClientRect().y + event?.pixel[1] + getRemSize() * 2;

      if (!this.button) {
        this.button = new FinishButton();
        this.button.show(x, y);
        this.button.onClick = () => this.onFinishDrawing && this.onFinishDrawing();
      } else {
        this.button.move(x, y);
      }
    }

    if (event.type === MapBrowserEventType.DBLCLICK) {
      this.hideButton();
    }

    return true;
  }

  public hideButton() {
    this.button?.hide();
    this.button = undefined;
  }

  public dispose() {
    this.hideButton();
    super.dispose();
  }
}
