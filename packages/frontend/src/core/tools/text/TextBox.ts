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

export const logger = Logger.get('TextBox.ts');

export class TextBox {
  private backdrop?: HTMLDivElement;
  private inputBox?: HTMLDivElement;

  public onValidation?: (text: string) => void;
  public onCancel?: () => void;

  // Show textbox at specified position, and return user input or false if action have been canceled
  public show(text: string, x: number, y: number): void {
    this.backdrop = document.createElement('div');
    this.inputBox = document.createElement('div');
    const textarea = document.createElement('textarea');
    const buttonBox = document.createElement('div');
    const button = document.createElement('button');

    this.backdrop.style.position = 'fixed';
    this.backdrop.style.top = '0';
    this.backdrop.style.right = '0';
    this.backdrop.style.left = '0';
    this.backdrop.style.bottom = '0';
    this.backdrop.addEventListener('click', () => {
      this.hide();
      this.onCancel && this.onCancel();
    });

    this.inputBox.style.display = 'flex';
    this.inputBox.style.justifyContent = 'center';
    this.inputBox.style.alignItems = 'flex-start';
    this.inputBox.style.borderRadius = '0.4rem';
    this.inputBox.style.position = 'absolute';
    this.inputBox.style.left = x + 'px';
    this.inputBox.style.top = y - 30 + 'px';

    textarea.cols = 25;
    textarea.rows = 2;
    textarea.value = text;
    textarea.dataset['cy'] = 'text-box';
    textarea.className = 'form-control';
    textarea.dataset['testid'] = 'text-box';

    button.innerText = 'Ok';
    button.type = 'button';
    button.className = 'btn btn-outline-primary abc-text-box-button';
    button.dataset['cy'] = 'text-box-validate';
    button.dataset['testid'] = 'validate';
    button.addEventListener('click', () => {
      this.hide();
      this.onValidation && this.onValidation(textarea.value);
    });

    this.inputBox.append(textarea);
    buttonBox.append(button);
    this.inputBox.append(buttonBox);
    document.body.append(this.backdrop);
    document.body.append(this.inputBox);

    // We must delay focus otherwise it happens before element setup
    setTimeout(() => textarea.focus(), 100);
  }

  private hide(): void {
    this.backdrop && document.body.removeChild(this.backdrop);
    this.inputBox && document.body.removeChild(this.inputBox);
  }

  public dispose(): void {
    try {
      this.hide();
      this.onCancel && this.onCancel();
    } catch (err) {
      logger.error('Text box dispose error: ', err);
    }
  }
}
