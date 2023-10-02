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

import { MapWrapper } from '../../../../core/geo/map/MapWrapper';
import { FeatureCollection } from 'geojson';
import franceRegionsGeojson from './france-regions.geojson';
import bufferSampleData from './buffer-sample-data.geojson';
import { GeoJSON } from 'ol/format';
import VectorSource from 'ol/source/Vector';
import { LayerFactory } from '../../../../core/geo/layers/LayerFactory';

export async function setupFranceRegions(map: MapWrapper) {
  const alreadyExists = map.getLayers().find((lay) => lay.getName() === 'Regions of France');
  if (alreadyExists) {
    return;
  }

  // We fetch sample dataset and add it as a vector layer
  const data: FeatureCollection | undefined = await fetch(franceRegionsGeojson).then((res) => res.json());
  if (!data) {
    throw new Error('Invalid dataset');
  }

  const geojsonReader = new GeoJSON();
  const features = geojsonReader.readFeatures(data, { featureProjection: map.getProjection().name, dataProjection: 'EPSG:4326' });
  const source = new VectorSource({ features });
  const vectorLayer = LayerFactory.newVectorLayer(source);
  vectorLayer.setName('Regions of France');
  map.addLayer(vectorLayer);
}

export async function setupBufferSampleData(map: MapWrapper) {
  const alreadyExists = map.getLayers().find((lay) => lay.getName() === 'Buffer sample data');
  if (alreadyExists) {
    return;
  }

  // We fetch sample dataset and add it as a vector layer
  const data: FeatureCollection | undefined = await fetch(bufferSampleData).then((res) => res.json());
  if (!data) {
    throw new Error('Invalid dataset');
  }

  const geojsonReader = new GeoJSON();
  const features = geojsonReader.readFeatures(data, { featureProjection: map.getProjection().name, dataProjection: 'EPSG:4326' });
  const source = new VectorSource({ features });
  const vectorLayer = LayerFactory.newVectorLayer(source);
  vectorLayer.setName('Buffer sample data');
  map.addLayer(vectorLayer);
}
