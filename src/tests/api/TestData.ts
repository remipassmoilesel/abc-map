import * as path from 'path';

const dataDir = path.resolve(__dirname, '../../../src/tests/example-data');

export class TestData {
    public static SAMPLE_GPX = path.resolve(dataDir, 'sample.gpx');
    public static SAMPLE_KML = path.resolve(dataDir, 'sample.kml');
}