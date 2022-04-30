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

import { AbcLayer, BasicAuthentication, EPSG_4326, FeatureStyle, LayerType, Logger, normalizedProjectionName, ProjectionDto } from '@abc-map/shared';
import { MapWrapper } from './map/MapWrapper';
import { MapFactory } from './map/MapFactory';
import { MainStore } from '../store/store';
import { AxiosInstance } from 'axios';
import { GeoJSON } from 'ol/format';
import { parseWmsCapabilities, WmsCapabilities } from './WmsCapabilities';
import { UpdateStyleChangeset, UpdateStyleItem } from '../history/changesets/features/UpdateStyleChangeset';
import { HistoryKey } from '../history/HistoryKey';
import { HistoryService } from '../history/HistoryService';
import { NominatimResult } from './NominatimResult';
import { FeatureWrapper } from './features/FeatureWrapper';
import { ToastService } from '../ui/ToastService';
import { LayerFactory } from './layers/LayerFactory';
import { Coordinate } from 'ol/coordinate';
import { parseWmtsCapabilities, WmtsCapabilities } from './WmtsCapabilities';
import { register } from 'ol/proj/proj4';
import { get as getProjection, transformExtent } from 'ol/proj';
import proj4 from 'proj4';
import { Extent } from 'ol/extent';
import { optionsFromCapabilities } from 'ol/source/WMTS';
import { LayerWrapper } from './layers/LayerWrapper';
import VectorSource from 'ol/source/Vector';
import { WmtsSettings, WmtsSourceOptions } from './layers/LayerFactory.types';
import { ProjectionRoutes } from '../http/ApiRoutes';

export const logger = Logger.get('GeoService.ts');

/**
 * These projections are supported by OL and do not need external projection loading.
 */
const OlSupportedProjections = ['EPSG:4326', 'CRS:84', 'EPSG:3857', 'EPSG:102100', 'EPSG:102113', 'EPSG:900913'];

export declare type StyleTransformFunc = (x: FeatureStyle, f: FeatureWrapper) => FeatureStyle | undefined;

export class GeoService {
  private mainMap = MapFactory.createDefault();

  constructor(
    private apiClient: AxiosInstance,
    private capabilitiesClient: AxiosInstance,
    private toasts: ToastService,
    private history: HistoryService,
    private store: MainStore,
    private wmsCapabilitiesParser = parseWmsCapabilities,
    private wmtsCapabilitiesParser = parseWmtsCapabilities
  ) {}

  /**
   * Main map is the map used for edition. But it also hold all data of current project in order to stay
   * memory efficient.
   *
   * It must be mount ONLY on edit map.
   */
  public getMainMap(): MapWrapper {
    return this.mainMap;
  }

  public getUserPosition(): Promise<Coordinate> {
    return new Promise<Coordinate>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
        (err) => reject(err)
      );
    });
  }

  public async exportLayers(map: MapWrapper): Promise<AbcLayer[]> {
    const layers = map.getLayers();
    const result: AbcLayer[] = [];

    for (const layer of layers) {
      const lay = await layer.toAbcLayer();
      result.push(lay);
    }
    return result;
  }

  public async importLayers(layers: AbcLayer[]): Promise<void> {
    const map = this.getMainMap();
    map.unwrap().getLayers().clear();

    for (const abcLayer of layers) {
      const layer = await this.toOlLayer(abcLayer);
      map.addLayer(layer);
    }
  }

  public async toOlLayer(abcLayer: AbcLayer): Promise<LayerWrapper> {
    let layer: LayerWrapper | undefined;

    // Predefined layer
    if (LayerType.Predefined === abcLayer.type) {
      layer = LayerFactory.newPredefinedLayer(abcLayer.metadata.model);
      layer.setMetadata(abcLayer.metadata);
    }

    // Vector layer
    else if (LayerType.Vector === abcLayer.type) {
      const geoJson = new GeoJSON();
      const source = new VectorSource({
        features: geoJson.readFeatures(abcLayer.features),
      });

      layer = LayerFactory.newVectorLayer(source);
      layer.setMetadata(abcLayer.metadata);
    }

    // Wms layer
    else if (LayerType.Wms === abcLayer.type) {
      layer = LayerFactory.newWmsLayer(abcLayer.metadata);
      layer.setMetadata(abcLayer.metadata);
    }

    // Wmts layer
    else if (LayerType.Wmts === abcLayer.type) {
      const meta = abcLayer.metadata;
      const capabilities = await this.getWmtsCapabilities(meta.capabilitiesUrl, meta.auth);
      const settings: WmtsSettings = {
        capabilitiesUrl: meta.capabilitiesUrl,
        remoteLayerName: meta.remoteLayerName,
        sourceOptions: await this.getWmtsLayerOptions(meta.remoteLayerName, capabilities),
        auth: abcLayer.metadata.auth,
      };

      layer = LayerFactory.newWmtsLayer(settings);
      layer.setMetadata(abcLayer.metadata);
    }

    // Xyz layer
    else if (LayerType.Xyz === abcLayer.type) {
      layer = LayerFactory.newXyzLayer(abcLayer.metadata.remoteUrl, abcLayer.metadata.projection);
      layer.setMetadata(abcLayer.metadata);
    }

    if (!layer) {
      throw new Error(`Unhandled layer type: ${(abcLayer as AbcLayer).type}`);
    }

    return layer;
  }

  /**
   * Warning: responses can be VERY heavy
   */
  public async getWmsCapabilities(url: string, auth?: BasicAuthentication): Promise<WmsCapabilities> {
    let capabilitiesUrl = url;
    if (url.indexOf('?') === -1) {
      capabilitiesUrl = `${url}?service=wms&request=GetCapabilities`;
    }

    const xmlCapabilities = await this.capabilitiesClient.get(capabilitiesUrl, { auth }).then((res) => res.data);
    const result = this.wmsCapabilitiesParser(xmlCapabilities);
    if (!result?.Capability?.Layer?.Layer?.length) {
      return Promise.reject(new Error('Invalid WMS capabilities, no layer found'));
    }

    return result;
  }

  /**
   * Warning: responses can be VERY heavy
   */
  public async getWmtsCapabilities(url: string, auth?: BasicAuthentication): Promise<WmtsCapabilities> {
    let capabilitiesUrl = url;
    if (url.indexOf('?') === -1) {
      capabilitiesUrl = `${url}?service=wmts&request=GetCapabilities`;
    }

    const xmlCapabilities = await this.capabilitiesClient.get(capabilitiesUrl, { auth }).then((res) => res.data);
    const result = this.wmtsCapabilitiesParser(xmlCapabilities);
    if (!result?.Contents?.Layer?.length) {
      return Promise.reject(new Error('Invalid WMTS capabilities, no layer found'));
    }

    return result;
  }

  /**
   * This method return WMTS source options usable in a WMS layer.
   *
   * It will fetch WMTS settings from provided capabilities if any, or from specified URL.
   *
   * This method will load needed CRS too.
   *
   * @param layerName
   * @param capabilities
   */
  public async getWmtsLayerOptions(layerName: string, capabilities: WmtsCapabilities): Promise<WmtsSourceOptions> {
    // Find layer
    const layer = capabilities?.Contents?.Layer?.find((layer) => layer.Identifier === layerName);
    const matrixSetName = layer?.TileMatrixSetLink && layer.TileMatrixSetLink[0].TileMatrixSet;
    if (!layer || !matrixSetName) {
      return Promise.reject(new Error(`Layer ${layerName} not found or invalid on ${capabilities.ServiceIdentification?.Title}`));
    }

    // We load projection if any
    // FIXME: we should try to find a matrix set with compatible projection
    const projection = capabilities?.Contents?.TileMatrixSet?.find((tms) => tms.Identifier === matrixSetName)?.SupportedCRS;
    if (projection) {
      await this.loadProjection(projection);
    }

    // We create options with openlayers helper
    const options = optionsFromCapabilities(capabilities, { layer: layerName, matrixSet: matrixSetName });
    if (!options) {
      return Promise.reject(new Error('Invalid settings'));
    }

    return options;
  }

  /**
   * Call transform function on each selected feature of **active layer**. Transform function can return a new style object.
   *
   * Transformations will be registered in undo/redo history.
   *
   * Returns the number of features changed.
   *
   * @param transform
   */
  public updateSelectedFeatures(transform: StyleTransformFunc): number {
    const changeSets: UpdateStyleItem[] = [];

    this.getMainMap().forEachFeatureSelected((feat) => {
      const style = feat.getStyleProperties();
      const newStyle = transform(style, feat);
      if (newStyle) {
        changeSets.push({
          feature: feat,
          before: style,
          after: newStyle,
        });
      }
    });

    if (changeSets.length) {
      const cs = new UpdateStyleChangeset(changeSets);
      cs.apply().catch((err) => logger.error('Cannot apply style: ', err));
      this.history.register(HistoryKey.Map, cs);
    }

    return changeSets.length;
  }

  public async geocode(query: string): Promise<NominatimResult[]> {
    const url = 'https://nominatim.openstreetmap.org/search';
    return this.capabilitiesClient
      .get(url, {
        params: {
          q: query,
          format: 'json',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  /**
   * Load specified projection then return projection extent.
   *
   * @param code
   */
  public async loadProjection(code: string): Promise<Extent> {
    const _code = normalizedProjectionName(code);
    if (!_code) {
      return Promise.reject(new Error(`Cannot load projection ${code}, name is not valid`));
    }

    // Openlayers supports these projections out of the box
    if (OlSupportedProjections.includes(_code)) {
      return transformExtent([-180, -85, 180, 85], EPSG_4326.name, _code, 8);
    }

    // We fetch projection
    const projection = await this.apiClient.get<ProjectionDto | undefined>(ProjectionRoutes.findByCode(_code)).then((res) => res.data);
    const proj4Def = projection?.proj4;
    const bbox = projection?.bbox;
    if (!projection || !proj4Def || !bbox) {
      return Promise.reject(new Error(`Projection not found: ${_code}`));
    }

    // We register it
    proj4.defs(_code, proj4Def);
    proj4.defs(code, proj4Def);
    register(proj4);

    // We set extent for reprojection
    // See: https://openlayers.org/en/latest/doc/tutorials/raster-reprojection.html
    // See: https://openlayers.org/en/latest/examples/reprojection-by-code.html
    const proj = getProjection(_code);
    if (!proj) {
      return Promise.reject(new Error(`Projection not found: ${_code}, even after proj4.defs()`));
    }
    let worldExtent: Extent = [bbox[1], bbox[2], bbox[3], bbox[0]];
    proj.setWorldExtent(worldExtent);

    if (bbox[1] > bbox[3]) {
      worldExtent = [bbox[1], bbox[2], bbox[3] + 360, bbox[0]];
    }

    const extent = transformExtent(worldExtent, EPSG_4326.name, _code, 8);
    proj.setExtent(extent);
    return extent;
  }

  public deselectAllFeatures(): number {
    const features = this.getMainMap().getSelectedFeatures();
    features.forEach((f) => f.setSelected(false));

    this.getMainMap().getTool()?.deselectAll();

    return features.length;
  }
}
