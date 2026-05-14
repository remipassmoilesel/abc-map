/**
 * Copyright © 2026 Rémi Pace.
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

import { Logger, isE2eTests } from '@abc-map/shared';

const logger = Logger.get('FileIO.ts');

export enum InputType {
  Multiple = 'Multiple',
  Single = 'Single',
}

export enum InputResultType {
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
}

export interface FilesSelected {
  type: InputResultType.Confirmed;
  files: File[];
}

export interface Canceled {
  type: InputResultType.Canceled;
}

export declare type FilePromptResult = FilesSelected | Canceled;

let FileInput: HTMLInputElement | undefined;
let FileOutput: HTMLAnchorElement | undefined;

export class FileIO {
  /**
   * Open a file prompt.
   *
   * WARNING: As there are no reliable way to get notified on "cancel", promises here may never end.
   * WARNING: Also several input=file nodes can be present at the same time in document.
   *
   * @param type
   * @param accept
   */
  public static openPrompt(type = InputType.Single, accept?: string): Promise<FilePromptResult> {
    const { input } = FileIO.getElements();

    input.multiple = type === InputType.Multiple;
    input.accept = accept || '';

    return new Promise<FilePromptResult>((resolve, reject) => {
      input.onchange = () => {
        const files = input.files ? Array.from(input.files) : [];
        resolve({ type: InputResultType.Confirmed, files: files || [] });
      };

      input.onerror = (err) => {
        logger.error('Error during file selection: ', err);
        input.remove();
        reject(new Error('Error during file selection'));
      };

      if (!isE2eTests()) {
        input.click();
      }
    });
  }

  public static downloadBlob(blob: Blob, name: string): void {
    this.downloadDataString(URL.createObjectURL(blob), name);
  }

  public static downloadDataString(dataStr: string, name: string): void {
    const { output } = FileIO.getElements();

    output.setAttribute('href', dataStr);
    output.setAttribute('download', name);

    if (!isE2eTests()) {
      output.click();
    }
  }

  private static getElements(): { input: HTMLInputElement; output: HTMLAnchorElement } {
    if (!FileInput) {
      FileInput = document.createElement('input');
      FileInput.setAttribute('type', 'file');
      FileInput.style.display = 'none';
      FileInput.dataset.cy = 'file-input';
      document.body.appendChild(FileInput);
    }

    if (!FileOutput) {
      FileOutput = document.createElement('a');
      FileOutput.style.display = 'none';
      FileOutput.dataset.cy = 'file-output';
      document.body.appendChild(FileOutput);
    }

    return { input: FileInput, output: FileOutput };
  }
}
