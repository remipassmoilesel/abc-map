import { WktParser } from './WktParser';

describe('WktParser', function () {
  it('parsePrj() should succeed', async () => {
    const prjContent =
      // eslint-disable-next-line max-len
      'PROJCS["ETRS89 / ETRS-LAEA",GEOGCS["ETRS89",DATUM["European_Terrestrial_Reference_System_1989",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6258"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4258"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Azimuthal_Equal_Area"],PARAMETER["latitude_of_center",52],PARAMETER["longitude_of_center",10],PARAMETER["false_easting",4321000],PARAMETER["false_northing",3210000],AUTHORITY["EPSG","3035"],AXIS["X",EAST],AXIS["Y",NORTH]]';
    const prjBlob = new Blob([prjContent]);

    const parsed = await WktParser.parsePrj(prjBlob);
    expect(parsed?.original).toEqual(prjContent);
    expect(parsed?.wkt.type).toEqual('PROJCS');
    expect(parsed?.wkt.name).toEqual('ETRS89 / ETRS-LAEA');
    expect(parsed?.wkt.projName).toEqual('Lambert_Azimuthal_Equal_Area');
    expect(parsed?.wkt.srsCode).toEqual('ETRS89 / ETRS-LAEA');
  });

  it('parsePrj() should not fail', async () => {
    const prjBlob = new Blob(['']);

    const parsed = await WktParser.parsePrj(prjBlob);
    expect(parsed).toBeUndefined();
  });
});
