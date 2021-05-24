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

import TileLayer from 'ol/layer/Tile';
import { OSM, Stamen, TileWMS } from 'ol/source';
import uuid from 'uuid-random';
import VectorSource from 'ol/source/Vector';
import { tileLoadAuthenticated } from '../map/tileLoadAuthenticated';
import { GeoJSON } from 'ol/format';
import { AbcLayer, LayerType, PredefinedLayerModel, PredefinedMetadata, VectorMetadata, WmsDefinition, WmsMetadata } from '@abc-map/shared';
import { LayerWrapper, PredefinedLayerWrapper, VectorLayerWrapper, WmsLayerWrapper } from './LayerWrapper';
import VectorImageLayer from 'ol/layer/VectorImage';
import Geometry from 'ol/geom/Geometry';
import TileSource from 'ol/source/Tile';
import { FeatureWrapper } from '../features/FeatureWrapper';

export class LayerFactory {
  public static newPredefinedLayer(model: PredefinedLayerModel, meta?: PredefinedMetadata): PredefinedLayerWrapper {
    let name: string;
    let source: TileSource;
    switch (model) {
      case PredefinedLayerModel.OSM:
        source = new OSM();
        name = 'OpenStreetMap';
        break;
      case PredefinedLayerModel.StamenToner:
        source = new Stamen({ layer: 'toner' });
        name = 'Stamen Toner';
        break;
      case PredefinedLayerModel.StamenTonerLite:
        source = new Stamen({ layer: 'toner-lite' });
        name = 'Stamen Toner Lite';
        break;
      case PredefinedLayerModel.StamenTerrain:
        source = new Stamen({ layer: 'terrain' });
        name = 'Stamen Terrain';
        break;
      case PredefinedLayerModel.StamenWatercolor:
        source = new Stamen({ layer: 'watercolor' });
        name = 'Stamen Watercolor';
        break;
      default:
        throw new Error(`Unhandled predefined layer type: ${model}`);
    }

    const layer = new TileLayer({ source });

    const metadata: PredefinedMetadata = {
      id: uuid(),
      name,
      type: LayerType.Predefined,
      active: false,
      opacity: 1,
      visible: true,
      model,
      ...meta,
    };

    return LayerWrapper.from<TileLayer, TileSource, PredefinedMetadata>(layer).setMetadata(metadata);
  }

  public static newVectorLayer(source?: VectorSource): VectorLayerWrapper {
    const _source = source || new VectorSource();
    const layer = new VectorImageLayer({ source: _source });

    const metadata: VectorMetadata = {
      id: uuid(),
      name: 'Géométries',
      type: LayerType.Vector,
      active: false,
      opacity: 1,
      visible: true,
    };

    return LayerWrapper.from<VectorImageLayer, VectorSource<Geometry>, VectorMetadata>(layer).setMetadata(metadata);
  }

  public static newWmsLayer(def: WmsDefinition): WmsLayerWrapper {
    const tileLoadFunction = def.auth?.username && def.auth?.password ? tileLoadAuthenticated(def.auth) : undefined;

    // TODO: FIXME: which extent should we set ?
    const layer = new TileLayer({
      source: new TileWMS({
        url: def.remoteUrl,
        params: { LAYERS: def.remoteLayerName, TILED: true },
        tileLoadFunction,
        projection: def.projection?.name,
      }),
    });

    const metadata: WmsMetadata = {
      id: uuid(),
      name: def.remoteLayerName,
      type: LayerType.Wms,
      active: false,
      opacity: 1,
      visible: true,
      remoteUrl: def.remoteUrl,
      remoteLayerName: def.remoteLayerName,
      projection: def.projection,
      extent: def.extent,
      auth: def.auth,
    };

    return LayerWrapper.from<TileLayer, TileSource, WmsMetadata>(layer).setMetadata(metadata);
  }

  public static async fromAbcLayer(abcLayer: AbcLayer): Promise<LayerWrapper> {
    let layer: LayerWrapper | undefined;

    // Predefined layer
    if (LayerType.Predefined === abcLayer.type) {
      return this.newPredefinedLayer(abcLayer.metadata.model, abcLayer.metadata);
    }

    // Vector layer
    else if (LayerType.Vector === abcLayer.type) {
      const geoJson = new GeoJSON();
      const source = new VectorSource({
        features: geoJson.readFeatures(abcLayer.features),
      });

      layer = this.newVectorLayer(source);
      layer.setMetadata(abcLayer.metadata);
      source.getFeatures().forEach((f) => FeatureWrapper.from(f).applyStyle());
    }

    // Wms layer
    else if (LayerType.Wms === abcLayer.type) {
      layer = this.newWmsLayer(abcLayer.metadata);
      layer.setMetadata(abcLayer.metadata);
    }

    if (!layer) {
      return Promise.reject(new Error(`Unhandled layer type: ${(abcLayer as AbcLayer).type}`));
    }

    return layer;
  }
}
