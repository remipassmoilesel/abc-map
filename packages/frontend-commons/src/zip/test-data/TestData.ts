import { promises as fs } from 'fs';
import * as path from 'path';

export class TestData {
  public async getSampleArchive(): Promise<Blob> {
    return this.readFile('./archive.zip');
  }

  private async readFile(name: string): Promise<Blob> {
    const absPath = path.resolve(__dirname, name);
    const buffer = await fs.readFile(absPath);
    return new Blob([buffer]);
  }
}
