/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

export enum FileFormat {
  ZIP = 'ZIP',
  GPX = 'GPX',
  KML = 'KML',
  SHAPEFILE = 'SHAPEFILE',
  GEOJSON = 'GEOJSON',
  WMS_DEFINITION = 'WMS_DEFINITION',
  WMTS_DEFINITION = 'WMTS_DEFINITION',
  XYZ_DEFINITION = 'XYZ_DEFINITION',
}

const extensionMap: { [k: string]: string[] | undefined } = {
  [FileFormat.ZIP]: ['.zip'],
  [FileFormat.GPX]: ['.gpx'],
  [FileFormat.KML]: ['.kml'],
  [FileFormat.SHAPEFILE]: ['.shp', '.dbf'],
  [FileFormat.GEOJSON]: ['.geojson', '.json'],
  [FileFormat.WMS_DEFINITION]: ['.wms'],
  [FileFormat.WMTS_DEFINITION]: ['.wmts'],
  [FileFormat.XYZ_DEFINITION]: ['.xyz'],
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
