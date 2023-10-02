/**
 * Copyright © 2023 Rémi Pace.
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

import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { Format } from './Format';
import { AbcFile, AbcProjection } from '@abc-map/shared';
import { GeoJSON, GPX, KML, WKT } from 'ol/format';

/**
 * Export layer to specified format.
 *
 * You MUST specify the source projection because it is not set on layers by default.
 *
 * @param layer
 * @param sourceProjection
 * @param format
 */
export async function exportLayer(layer: VectorLayerWrapper, sourceProjection: AbcProjection, format: Format): Promise<AbcFile<Blob>[]> {
  const features = layer.getSource().getFeatures();

  // GeoJSON format
  if (Format.GeoJSON === format && layer.isVector()) {
    const geojsonWriter = new GeoJSON();
    const geojson = geojsonWriter.writeFeatures(features, { featureProjection: sourceProjection.name, dataProjection: 'EPSG:4326' });
    return [{ content: new Blob([geojson]), path: layer.getName() + '.geojson' }];
  }

  // GPX format
  else if (Format.GPX === format && layer.isVector()) {
    const gpxWriter = new GPX();
    const gpx = gpxWriter.writeFeatures(features, { featureProjection: sourceProjection.name, dataProjection: 'EPSG:4326' });
    return [{ content: new Blob([gpx]), path: layer.getName() + '.gpx' }];
  }

  // KML format
  else if (Format.KML === format && layer.isVector()) {
    const kmlWriter = new KML();
    const kml = kmlWriter.writeFeatures(features, { featureProjection: sourceProjection.name, dataProjection: 'EPSG:4326' });
    return [{ content: new Blob([kml]), path: layer.getName() + '.kml' }];
  }

  // WKT format
  else if (Format.WKT === format && layer.isVector()) {
    const wktWriter = new WKT();
    const wkt = wktWriter.writeFeatures(features, { featureProjection: sourceProjection.name, dataProjection: 'EPSG:4326' });
    return [{ content: new Blob([wkt]), path: layer.getName() + '.wkt' }];
  }

  // Not supported
  else {
    throw new Error('Unsupported format or layer: format=' + format + ' layer=' + layer.getName());
  }
}
