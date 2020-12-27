import { promises as fs } from 'fs';
import * as path from 'path';

export class TestData {
  public async getSampleGpx(): Promise<Blob> {
    return this.readFile('./campings-bretagne.gpx');
  }

  public async getSampleKml(): Promise<Blob> {
    return this.readFile('./KML_Samples.kml');
  }

  public async getSampleGeojson(): Promise<Blob> {
    return this.readFile('./stations.geojson');
  }

  public async getSampleArchive(): Promise<Blob> {
    return this.readFile('./archive.zip');
  }

  public async getSampleShapefile(): Promise<Blob> {
    return this.readFile('./world-cities.zip');
  }

  private async readFile(name: string): Promise<Blob> {
    const absPath = path.resolve(__dirname, name);
    const buffer = await fs.readFile(absPath);
    return new Blob([buffer]);
  }
}
