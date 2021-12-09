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

import { Env } from './Env';
import { Logger } from '@abc-map/shared';

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

export declare type FileInputResult = FilesSelected | Canceled;

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
  public static openInput(type = InputType.Single, accept?: string): Promise<FileInputResult> {
    const fileNode = document.createElement('input');
    fileNode.setAttribute('type', 'file');
    fileNode.multiple = type === InputType.Multiple;
    fileNode.style.display = 'none';
    fileNode.dataset.cy = 'file-input';
    fileNode.accept = accept || '';
    document.body.appendChild(fileNode);

    return new Promise<FileInputResult>((resolve, reject) => {
      fileNode.onchange = () => {
        const files = fileNode.files ? Array.from(fileNode.files) : [];
        fileNode.remove();
        resolve({ type: InputResultType.Confirmed, files: files || [] });
      };

      fileNode.onerror = (err) => {
        logger.error('Error during file selection: ', err);
        fileNode.remove();
        reject(new Error('Error during file selection'));
      };

      if (!Env.isE2e()) {
        fileNode.click();
      }
    });
  }

  public static outputBlob(blob: Blob, name: string): void {
    this.outputString(URL.createObjectURL(blob), name);
  }

  public static outputString(dataStr: string, name: string): void {
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', name);
    anchor.dataset.cy = 'file-output';

    document.body.appendChild(anchor);
    if (!Env.isE2e()) {
      anchor.click();
      anchor.remove();
    }
  }
}
