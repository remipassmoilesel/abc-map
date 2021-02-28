import { Env } from './Env';
import { Logger } from './Logger';

const logger = Logger.get('FileIO.ts');

export enum FileInputType {
  FilesSelected = 'FilesSelected',
  Canceled = 'Canceled',
}

export interface FilesSelected {
  type: FileInputType.FilesSelected;
  files: File[];
}

export interface Canceled {
  type: FileInputType.Canceled;
}

export declare type FileInputResult = FilesSelected | Canceled;

export class FileIO {
  public static openInput(multiple = false): Promise<FileInputResult> {
    const fileNode = document.createElement('input');
    fileNode.setAttribute('type', 'file');
    fileNode.multiple = multiple;
    fileNode.style.display = 'none';
    fileNode.dataset.cy = 'file-input';
    document.body.appendChild(fileNode);

    return new Promise<FileInputResult>((resolve, reject) => {
      fileNode.onchange = () => {
        const files = fileNode.files ? Array.from(fileNode.files) : [];
        fileNode.remove();
        resolve({ type: FileInputType.FilesSelected, files: files || [] });
      };

      fileNode.oncancel = () => {
        fileNode.remove();
        resolve({ type: FileInputType.Canceled });
      };

      fileNode.onerror = (err) => {
        logger.error('Error during file selection: ', err);
        reject(new Error('Error during file selection'));
      };

      if (!Env.isE2e()) {
        fileNode.click();
      }
    });
  }

  public static output(dataStr: string, name: string): void {
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
