import { FileFormat, FileFormats } from './FileFormats';

describe('FileFormats.ts', function () {
  it('should work', function () {
    expect(FileFormats.fromPath('')).toBeUndefined();
    expect(FileFormats.fromPath('test.KML')).toEqual(FileFormat.KML);
    expect(FileFormats.fromPath('test.kml')).toEqual(FileFormat.KML);
    expect(FileFormats.fromPath('test.GPX')).toEqual(FileFormat.GPX);
    expect(FileFormats.fromPath('test.gpx')).toEqual(FileFormat.GPX);
    expect(FileFormats.fromPath('test.SHP')).toEqual(FileFormat.SHAPEFILE);
    expect(FileFormats.fromPath('test.shp')).toEqual(FileFormat.SHAPEFILE);
    expect(FileFormats.fromPath('test.dbf')).toEqual(FileFormat.SHAPEFILE);
  });
});
