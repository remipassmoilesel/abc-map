export enum FileFormat {
  ZIP = 'ZIP',
  GPX = 'GPX',
  KML = 'KML',
  SHAPEFILE = 'SHAPEFILE',
  WMS_DEFINITION = 'WMS_DEFINITION',
  ABM2 = 'ABM2',
  GEOJSON = 'GEOJSON',
}

declare type ExtensionMap = { [k: string]: string[] | undefined };
const extensionMap: ExtensionMap = {
  [FileFormat.ZIP]: ['.zip'],
  [FileFormat.GPX]: ['.gpx'],
  [FileFormat.KML]: ['.kml'],
  [FileFormat.SHAPEFILE]: ['.shp', '.dbf'],
  [FileFormat.ABM2]: ['.abm2'],
  [FileFormat.GEOJSON]: ['.geojson', '.json'],
  [FileFormat.WMS_DEFINITION]: ['.wms'],
};

export class FileFormats {
  public static fromPath(path: string): FileFormat | undefined {
    const lower = path.toLocaleLowerCase();
    for (const format in extensionMap) {
      const exts = extensionMap[format] || [];
      const match = exts.find((ext) => lower.endsWith(ext));
      if (match) {
        return format as FileFormat;
      }
    }
  }
}
