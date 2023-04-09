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
import { AbcProjection, LayerType, PredefinedLayerModel, PredefinedMetadata, VectorMetadata, WmsMetadata, WmtsMetadata, XyzMetadata } from '@abc-map/shared';
import { LayerWrapper, PredefinedLayerWrapper, VectorLayerWrapper, WmsLayerWrapper, WmtsLayerWrapper, XyzLayerWrapper } from './LayerWrapper';
import VectorImageLayer from 'ol/layer/VectorImage';
import Geometry from 'ol/geom/Geometry';
import TileSource from 'ol/source/Tile';
import { styleFunction } from '../styles/style-function';
import { tileLoadingPublic } from './tileLoadingPublic';
import { WmsSettings, WmtsSettings } from './LayerFactory.types';
import { prefixedTranslation } from '../../../i18n/i18n';
import { DefaultStyleOptions } from '../styles/StyleFactoryOptions';

const t = prefixedTranslation('LayerFactory:');

export class LayerFactory {
  public static newPredefinedLayer(model: PredefinedLayerModel): PredefinedLayerWrapper {
    let name: string;
    let source: TileSource;
    switch (model) {
      case PredefinedLayerModel.OSM:
        source = new OSM();
        name = t('OpenStreetMap');
        break;
      case PredefinedLayerModel.StamenToner:
        source = new Stamen({ layer: 'toner' });
        name = t('Stamen_Toner');
        break;
      case PredefinedLayerModel.StamenTonerLite:
        source = new Stamen({ layer: 'toner-lite' });
        name = t('Stamen_Toner_Lite');
        break;
      case PredefinedLayerModel.StamenTerrain:
        source = new Stamen({ layer: 'terrain' });
        name = t('Stamen_Terrain');
        break;
      case PredefinedLayerModel.StamenWatercolor:
        source = new Stamen({ layer: 'watercolor' });
        name = t('Stamen_Watercolor');
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

    return LayerWrapper.from<TileLayer<TileSource>, TileSource, PredefinedMetadata>(layer).setMetadata(metadata);
  }

  public static newVectorLayer(source?: VectorSource<Geometry>): VectorLayerWrapper {
    const _source = source || new VectorSource();
    const layer = new VectorImageLayer({ style: (f) => styleFunction(DefaultStyleOptions, f), source: _source });

    const metadata: VectorMetadata = {
      id: uuid(),
      name: t('Geometries'),
      type: LayerType.Vector,
      active: false,
      opacity: 1,
      visible: true,
    };

    return LayerWrapper.from<VectorImageLayer<VectorSource<Geometry>>, VectorSource<Geometry>, VectorMetadata>(layer).setMetadata(metadata);
  }

  public static newWmsLayer(settings: WmsSettings): WmsLayerWrapper {
    const tileLoadFunction = settings.auth?.username && settings.auth?.password ? tileLoadingAuthenticated(settings.auth) : tileLoadingPublic();

    const layer = new TileLayer({
      extent: settings.extent,
      source: new TileWMS({
        urls: settings.remoteUrls,
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
      remoteUrls: settings.remoteUrls,
      remoteLayerName: settings.remoteLayerName,
      projection: settings.projection,
      extent: settings.extent,
      auth: settings.auth,
    };

    return LayerWrapper.from<TileLayer<TileSource>, TileWMS, WmsMetadata>(layer).setMetadata(metadata);
  }

  public static newWmtsLayer(settings: WmtsSettings): WmtsLayerWrapper {
    if (!settings.sourceOptions) {
      throw new Error('Source options are mandatory');
    }

    const tileLoadFunction = settings.auth?.username && settings.auth?.password ? tileLoadingAuthenticated(settings.auth) : tileLoadingPublic();

    // We do not set extent here as it can have weird behaviors
    const layer = new TileLayer({
      source: new WMTS({
        ...settings.sourceOptions,
        tileLoadFunction,
      }),
    });

    const metadata: WmtsMetadata = {
      id: uuid(),
      name: settings.remoteLayerName,
      type: LayerType.Wmts,
      active: false,
      opacity: 1,
      visible: true,
      capabilitiesUrl: settings.capabilitiesUrl,
      remoteLayerName: settings.remoteLayerName,
      auth: settings.auth,
    };

    return LayerWrapper.from<TileLayer<TileSource>, WMTS, WmtsMetadata>(layer).setMetadata(metadata);
  }

  public static newXyzLayer(url: string, projection?: AbcProjection): XyzLayerWrapper {
    const source = new XYZ({ url, projection: projection?.name, tileLoadFunction: tileLoadingPublic() });
    const layer = new TileLayer({ source });

    const metadata: XyzMetadata = {
      id: uuid(),
      name: t('XYZ_layer'),
      type: LayerType.Xyz,
      active: false,
      opacity: 1,
      visible: true,
      remoteUrl: url,
      projection,
    };

    return LayerWrapper.from<TileLayer<TileSource>, XYZ, XyzMetadata>(layer).setMetadata(metadata);
  }
}
