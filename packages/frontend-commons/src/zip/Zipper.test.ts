import { TestData } from './test-data/TestData';
import { Zipper } from './Zipper';
import { AbcFile } from '../AbcFile';

describe('Zipper', () => {
  const testData = new TestData();

  it('should unzip', async () => {
    const archive = await testData.getSampleArchive();

    const result = await Zipper.unzip(archive);

    const paths = result.map((r) => r.path).sort();
    expect(paths).toEqual(['KML_Samples.kml', 'campings-bretagne.gpx', 'stations.geojson']);

    const sizes = result.map((r) => r.content.size).sort();
    expect(sizes).toEqual([35920, 57320, 61616]);
  });

  it('should zip', async () => {
    const testFile: AbcFile = { path: 'test.json', content: new Blob([JSON.stringify({ a: 'b', c: 'd', e: 'f' })]) };

    const result = await Zipper.zipFiles([testFile]);

    expect(result.size).toEqual(139);
  });
});
