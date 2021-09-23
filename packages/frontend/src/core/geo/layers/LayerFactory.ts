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
import { OSM, Stamen, TileWMS, WMTS, XYZ } from 'ol/source';
import uuid from 'uuid-random';
import VectorSource from 'ol/source/Vector';
import { tileLoadingAuthenticated } from './tileLoadingAuthenticated';
import { GeoJSON } from 'ol/format';
import {
  AbcLayer,
  AbcProjection,
  LayerType,
  PredefinedLayerModel,
  PredefinedMetadata,
  VectorMetadata,
  WmsMetadata,
  WmtsMetadata,
  XyzMetadata,
} from '@abc-map/shared';
import { LayerWrapper, PredefinedLayerWrapper, VectorLayerWrapper, WmsLayerWrapper, WmtsLayerWrapper, XyzLayerWrapper } from './LayerWrapper';
import VectorImageLayer from 'ol/layer/VectorImage';
import Geometry from 'ol/geom/Geometry';
import TileSource from 'ol/source/Tile';
import { styleFunction } from '../styles/style-function';
import { tileLoadingPublic } from './tileLoadingPublic';
import { WmsSettings, WmtsSettings } from './LayerFactory.types';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

export class LayerFactory {
  public static newPredefinedLayer(model: PredefinedLayerModel): PredefinedLayerWrapper {
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
    };

    return LayerWrapper.from<TileLayer, TileSource, PredefinedMetadata>(layer).setMetadata(metadata);
  }

  public static newVectorLayer(source?: VectorSource): VectorLayerWrapper {
    const _source = source || new VectorSource();
    const layer = new VectorImageLayer({ style: (f) => styleFunction(1, f), source: _source });

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

  public static newWmsLayer(settings: WmsSettings): WmsLayerWrapper {
    const tileLoadFunction = settings.auth?.username && settings.auth?.password ? tileLoadingAuthenticated(settings.auth) : tileLoadingPublic();

    const layer = new TileLayer({
      extent: settings.extent,
      source: new TileWMS({
        url: settings.remoteUrl,
        params: { LAYERS: settings.remoteLayerName, TILED: true },
        tileLoadFunction,
        projection: settings.projection?.name,
      }),
    });

    const metadata: WmsMetadata = {
      id: uuid(),
      name: settings.remoteLayerName,
      type: LayerType.Wms,
      active: false,
      opacity: 1,
      visible: true,
      remoteUrl: settings.remoteUrl,
      remoteLayerName: settings.remoteLayerName,
      projection: settings.projection,
      extent: settings.extent,
      auth: settings.auth,
    };

    return LayerWrapper.from<TileLayer, TileWMS, WmsMetadata>(layer).setMetadata(metadata);
  }

  public static newWmtsLayer(settings: WmtsSettings): WmtsLayerWrapper {
    const tileLoadFunction = settings.auth?.username && settings.auth?.password ? tileLoadingAuthenticated(settings.auth) : tileLoadingPublic();

    const layer = new TileLayer({
      extent: settings.extent,
      source: new WMTS({
        url: settings.remoteUrl,
        layer: settings.remoteLayerName,
        matrixSet: settings.matrixSet,
        tileLoadFunction,
        style: settings.style,
        projection: settings.projection?.name,
        tileGrid: new WMTSTileGrid({
          origins: settings.origins,
          matrixIds: settings.matrixIds,
          resolutions: settings.resolutions,
          extent: settings.extent,
        }),
      }),
    });

    const metadata: WmtsMetadata = {
      id: uuid(),
      name: settings.remoteLayerName,
      type: LayerType.Wmts,
      active: false,
      opacity: 1,
      visible: true,
      remoteUrl: settings.remoteUrl,
      remoteLayerName: settings.remoteLayerName,
      matrixSet: settings.matrixSet,
      style: settings.style,
      auth: settings.auth,
      resolutions: settings.resolutions,
      matrixIds: settings.matrixIds,
      projection: settings.projection,
      origins: settings.origins,
      extent: settings.extent,
    };

    return LayerWrapper.from<TileLayer, WMTS, WmtsMetadata>(layer).setMetadata(metadata);
  }

  public static newXyzLayer(url: string, projection?: AbcProjection): XyzLayerWrapper {
    const source = new XYZ({ url, projection: projection?.name, tileLoadFunction: tileLoadingPublic() });
    const layer = new TileLayer({ source });

    const metadata: XyzMetadata = {
      id: uuid(),
      name: 'Couche XYZ',
      type: LayerType.Xyz,
      active: false,
      opacity: 1,
      visible: true,
      remoteUrl: url,
      projection: projection,
    };

    return LayerWrapper.from<TileLayer, XYZ, XyzMetadata>(layer).setMetadata(metadata);
  }

  public static fromAbcLayer(abcLayer: AbcLayer): LayerWrapper {
    let layer: LayerWrapper | undefined;

    // Predefined layer
    if (LayerType.Predefined === abcLayer.type) {
      layer = this.newPredefinedLayer(abcLayer.metadata.model);
      layer.setMetadata(abcLayer.metadata);
    }

    // Vector layer
    else if (LayerType.Vector === abcLayer.type) {
      const geoJson = new GeoJSON();
      const source = new VectorSource({
        features: geoJson.readFeatures(abcLayer.features),
      });

      layer = this.newVectorLayer(source);
      layer.setMetadata(abcLayer.metadata);
    }

    // Wms layer
    else if (LayerType.Wms === abcLayer.type) {
      layer = this.newWmsLayer(abcLayer.metadata);
      layer.setMetadata(abcLayer.metadata);
    }

    // Wmts layer
    else if (LayerType.Wmts === abcLayer.type) {
      layer = this.newWmtsLayer(abcLayer.metadata);
      layer.setMetadata(abcLayer.metadata);
    }

    // Xyz layer
    else if (LayerType.Xyz === abcLayer.type) {
      layer = this.newXyzLayer(abcLayer.metadata.remoteUrl, abcLayer.metadata.projection);
      layer.setMetadata(abcLayer.metadata);
    }

    if (!layer) {
      throw new Error(`Unhandled layer type: ${(abcLayer as AbcLayer).type}`);
    }

    return layer;
  }
}
