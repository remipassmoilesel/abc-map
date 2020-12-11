import { AbcProject } from '@abc-map/shared-entities';

export class Abm2Reader {
  public static fromFile(file: File): Promise<AbcProject> {
    return new Promise<AbcProject>((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reject(new Error(`Cannot read file: ${file.name}`));
      };

      reader.onload = () => {
        if (!reader.result) {
          return reject(new Error(`Cannot read file: ${file.name}`));
        }
        try {
          resolve(JSON.parse(reader.result as string));
        } catch (e) {
          reject(e);
        }
      };

      reader.readAsText(file, 'UTF-8');
    });
  }
}
