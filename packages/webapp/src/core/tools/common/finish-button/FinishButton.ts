/**
 * Copyright © 2023 Rémi Pace.
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

export const logger = Logger.get('FinishButton.ts');

export class FinishButton {
  private button?: HTMLButtonElement;

  public onClick?: () => void;

  public show(x: number, y: number): void {
    this.button && document.body.removeChild(this.button);

    this.button = document.createElement('button');
    this.button.style.position = 'absolute';

    this.button.className = 'btn btn-sm btn-primary';
    this.button.innerHTML = 'OK';

    this.button.addEventListener('click', () => {
      this.hide();
      this.onClick && this.onClick();
    });

    document.body.append(this.button);
    this.move(x, y);
  }

  public move(x: number, y: number): void {
    if (!this.button) {
      throw new Error('You must call show() before');
    }

    this.button.style.left = x + 'px';
    this.button.style.top = y + 'px';
  }

  public hide(): void {
    if (!this.button) {
      logger.error('You must call show() before');
      return;
    }

    this.button.style.display = 'none';
  }

  public dispose(): void {
    this.button && document.body.removeChild(this.button);
  }
}
