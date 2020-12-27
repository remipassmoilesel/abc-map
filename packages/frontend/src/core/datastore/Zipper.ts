import JSZip from 'jszip';
import { Logger } from '../utils/Logger';
import { AbcFile } from '../data-readers/AbcFile';

const logger = Logger.get('Zipper.ts');

export class Zipper {
  public static zip(files: AbcFile[]): Promise<Blob> {
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.path, file.content));
    return zip.generateAsync({ type: 'blob' });
  }

  public static async unzip(content: Blob): Promise<AbcFile[]> {
    const zip = new JSZip();
    await zip.loadAsync(content);

    const result: AbcFile[] = [];
    for (const name in zip.files) {
      const file = await zip.file(name)?.async('blob');
      if (file) {
        result.push({ path: name, content: file });
      } else {
        logger.error(`Unable to read file: ${name}`);
      }
    }
    return result;
  }
}
