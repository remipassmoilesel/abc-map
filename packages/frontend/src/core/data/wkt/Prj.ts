export interface Prj {
  original: string;
  wkt: PrjWkt;
}

// TODO: improve typings
export interface PrjWkt {
  type: 'PROJCS';
  name: string;
  projName: string;
  srsCode: string;
  GEOGCS?: any;
  latitude_of_center?: number;
  longitude_of_center?: number;
  false_easting?: number;
  false_northing?: number;
  axis?: string;
  units?: string;
  to_meter?: 1;
  datumCode?: string;
  ellps?: string;
  a?: number;
  rf?: number;
  lat0?: number;
  longc?: number;
  x0?: number;
  y0?: number;
  long0?: number;
  UNIT?: any;
  PROJECTION?: string;
  AUTHORITY?: { EPSG: string };
  AXIS?: any;
}
