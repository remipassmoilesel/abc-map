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
import { Logger, WmtsLayerProperties, WmtsMetadata, XyzLayerProperties, XyzMetadata } from '@abc-map/shared';
import {
  AbcLayer,
  AbcProjection,
  BaseMetadata,
  LayerMetadata,
  LayerProperties,
  LayerType,
  PredefinedLayerModel,
  PredefinedLayerProperties,
  PredefinedMetadata,
  VectorMetadata,
  WmsLayerProperties,
  WmsMetadata,
} from '@abc-map/shared';
import uuid from 'uuid-random';
import { GeoJSON } from 'ol/format';
import BaseLayer from 'ol/layer/Base';
import TileSource from 'ol/source/Tile';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import VectorImageLayer from 'ol/layer/VectorImage';
import { Source, TileWMS, WMTS, XYZ } from 'ol/source';
import { Layer } from 'ol/layer';
import { styleFunction } from '../styles/style-function';
import { stripHtml } from '../../utils/strings';

export const logger = Logger.get('LayerWrapper');

export declare type OlLayers = Layer<Source> | VectorImageLayer<VectorSource<Geometry>> | TileLayer<TileSource>;
export declare type OlSources = Source | VectorSource<Geometry> | TileSource | TileWMS | WMTS;

export declare type VectorLayerWrapper = LayerWrapper<VectorImageLayer<VectorSource<Geometry>>, VectorSource<Geometry>, VectorMetadata>;
export declare type PredefinedLayerWrapper = LayerWrapper<TileLayer<TileSource>, TileSource, PredefinedMetadata>;
export declare type WmsLayerWrapper = LayerWrapper<TileLayer<TileSource>, TileWMS, WmsMetadata>;
export declare type WmtsLayerWrapper = LayerWrapper<TileLayer<TileSource>, WMTS, WmtsMetadata>;
export declare type XyzLayerWrapper = LayerWrapper<TileLayer<TileSource>, XYZ, XyzMetadata>;

export class LayerWrapper<Layer extends OlLayers = OlLayers, Source extends OlSources = OlSources, Meta extends LayerMetadata = LayerMetadata> {
  public static from<L extends OlLayers, S extends OlSources, M extends LayerMetadata>(layer: L): LayerWrapper<L, S, M> {
    return new LayerWrapper<L, S, M>(layer);
  }

  public static isManaged(layer: BaseLayer): boolean {
    const hasProperty = !!layer.get(LayerProperties.Managed);
    const isSupported = layer instanceof TileLayer || layer instanceof VectorImageLayer;
    return hasProperty && isSupported;
  }

  constructor(private layer: Layer) {}

  public unwrap(): Layer {
    return this.layer;
  }

  /**
   * This method is a workaround for borked types for VectorImageLayer. Used with isVector(), it provide a good typing.
   * VectorImageLayer should extends BaseLayer<VectorSource> but it does not.
   */
  public getSource(): Source {
    return this.layer.getSource() as Source;
  }

  public setId(value?: string): LayerWrapper {
    this.layer.set(LayerProperties.Id, value || uuid());
    return this;
  }

  public getId(): string | undefined {
    return this.layer.get(LayerProperties.Id);
  }

  /**
   * This method only set property "name", if you want to update UI you must use MapWrapper.setLayerName().
   * @param value
   */
  public setName(value: string): LayerWrapper {
    this.layer.set(LayerProperties.Name, value);
    return this;
  }

  public getName(): string | undefined {
    return this.layer.get(LayerProperties.Name);
  }

  /**
   * This method only set property "active", if you want to active layer une MapWrapper.setActiveLayer().
   * @param value
   */
  public setActive(value: boolean): LayerWrapper {
    this.layer.set(LayerProperties.Active, value);
    return this;
  }

  public isActive(): boolean {
    return this.layer.get(LayerProperties.Active) || false;
  }

  /**
   * Change layer visibility.
   *
   * /!\ UI will not be updated, for this use geoService.getMainMap().setLayerVisible().
   *
   * @param value
   */
  public setVisible(value: boolean): LayerWrapper {
    this.layer.setVisible(value);
    return this;
  }

  public isVisible(): boolean {
    return this.layer.getVisible();
  }

  public setOpacity(value: number): LayerWrapper {
    this.layer.setOpacity(value);
    return this;
  }

  public getOpacity(): number {
    return this.layer.getOpacity();
  }

  public getType(): LayerType | undefined {
    return this.layer.get(LayerProperties.Type);
  }

  public isPredefined(): this is PredefinedLayerWrapper {
    return this.getType() === LayerType.Predefined;
  }

  public isVector(): this is VectorLayerWrapper {
    return this.getType() === LayerType.Vector;
  }

  public isWms(): this is WmsLayerWrapper {
    return this.getType() === LayerType.Wms;
  }

  public isWmts(): this is WmtsLayerWrapper {
    return this.getType() === LayerType.Wmts;
  }

  public isXyz(): this is XyzLayerWrapper {
    return this.getType() === LayerType.Xyz;
  }

  /**
   * Shallow clone layer
   */
  public shallowClone(styleRatio = 1): LayerWrapper<Layer, Source, Meta> {
    let layer: TileLayer<TileSource> | VectorImageLayer<VectorSource<Geometry>>;
    if (this.isPredefined()) {
      layer = new TileLayer({ source: this.layer.getSource() as TileSource });
    } else if (this.isWms()) {
      layer = new TileLayer({ source: this.layer.getSource() as TileSource });
    } else if (this.isWmts()) {
      layer = new TileLayer({ source: this.layer.getSource() as WMTS });
    } else if (this.isXyz()) {
      layer = new TileLayer({ source: this.layer.getSource() as XYZ });
    } else if (this.isVector()) {
      layer = new VectorImageLayer({ source: this.layer.getSource() as VectorSource<Geometry>, style: (f) => styleFunction(styleRatio, f) });
    } else {
      throw new Error(`Cannot clone layer, type is not supported: ${this.getType()}`);
    }

    return LayerWrapper.from<Layer, Source, Meta>(layer as Layer).setMetadata(this.getMetadata() as Meta);
  }

  public getAttributions(): string[] | undefined {
    const getAttributions = this.layer.getSource().getAttributions();
    if (!getAttributions) {
      return;
    }

    let attributions = getAttributions({} as any); // Typings are borked
    attributions = attributions instanceof Array ? attributions : [attributions];
    return attributions.filter((s) => !!s).map((attr) => stripHtml(attr));
  }

  public setAttributions(attr: string[]): LayerWrapper<Layer, Source, Meta> {
    this.layer.getSource().setAttributions(attr);
    return this;
  }

  public setMetadata(props: Meta): LayerWrapper<Layer, Source, Meta> {
    this.layer.set(LayerProperties.Managed, true);
    this.layer.set(LayerProperties.Id, props.id);
    this.layer.set(LayerProperties.Name, props.name);
    this.layer.set(LayerProperties.Type, props.type);
    this.layer.set(LayerProperties.Active, props.active);
    this.layer.setOpacity(props.opacity);
    this.layer.setVisible(props.visible);
    if (props.attributions && props.attributions.length) {
      this.layer.getSource().setAttributions(props.attributions);
    }

    if (LayerType.Predefined === props.type) {
      this.setPredefinedMetadata(props as PredefinedMetadata);
    } else if (LayerType.Wms === props.type) {
      this.setWmsMetadata(props as WmsMetadata);
    } else if (LayerType.Wmts === props.type) {
      this.setWmtsMetadata(props as WmtsMetadata);
    } else if (LayerType.Xyz === props.type) {
      this.setXyzMetadata(props as XyzMetadata);
    }
    return this;
  }

  private setPredefinedMetadata(props: PredefinedMetadata): void {
    this.layer.set(PredefinedLayerProperties.Model, props.model);
  }

  private setXyzMetadata(props: XyzMetadata): void {
    this.layer.set(XyzLayerProperties.Url, props.remoteUrl);
    this.layer.set(XyzLayerProperties.Projection, props.projection);
  }

  private setWmsMetadata(props: WmsMetadata): void {
    this.layer.set(WmsLayerProperties.Urls, props.remoteUrls);
    this.layer.set(WmsLayerProperties.RemoteLayerName, props.remoteLayerName);
    this.layer.set(WmsLayerProperties.Username, props.auth?.username);
    this.layer.set(WmsLayerProperties.Password, props.auth?.password);
    this.layer.set(WmsLayerProperties.Projection, props.projection);
    this.layer.set(WmsLayerProperties.Extent, props.extent);
  }

  private setWmtsMetadata(props: WmtsMetadata): void {
    this.layer.set(WmtsLayerProperties.CapabilitiesUrl, props.capabilitiesUrl);
    this.layer.set(WmtsLayerProperties.LayerName, props.remoteLayerName);
    this.layer.set(WmtsLayerProperties.Username, props.auth?.username);
    this.layer.set(WmtsLayerProperties.Password, props.auth?.password);
  }

  public getMetadata(): Meta | undefined {
    // Types are buggy here
    if (this.isPredefined()) {
      return this.getPredefinedMetadata() as Meta;
    } else if (this.isVector()) {
      return this.getVectorMetadata() as Meta;
    } else if (this.isWms()) {
      return this.getWmsMetadata() as Meta;
    } else if (this.isWmts()) {
      return this.getWmtsMetadata() as Meta;
    } else if (this.isXyz()) {
      return this.getXyzMetadata() as Meta;
    }
  }

  private getBaseMetadata(): BaseMetadata | undefined {
    const id: string | undefined = this.layer.get(LayerProperties.Id);
    const name: string | undefined = this.layer.get(LayerProperties.Name);
    const type: LayerType | undefined = this.layer.get(LayerProperties.Type);
    const active: boolean | undefined = this.layer.get(LayerProperties.Active);
    const opacity: number | undefined = this.layer.getOpacity();
    const visible: boolean | undefined = this.layer.getVisible();
    const attributions: string[] | undefined = this.getAttributions();
    if (!id || !name || !type) {
      logger.error('Invalid layer: ', [this.layer, id, name, type]);
      return;
    }

    return {
      id,
      name,
      type,
      attributions,
      opacity: opacity ?? 1,
      active: active ?? false,
      visible: visible ?? true,
    };
  }

  private getPredefinedMetadata(): PredefinedMetadata | undefined {
    const base = this.getBaseMetadata();
    if (!base) {
      return;
    }

    const model: PredefinedLayerModel | undefined = this.layer.get(PredefinedLayerProperties.Model);
    if (base.type !== LayerType.Predefined || !model) {
      logger.error('Invalid layer: ', [this.layer, base, model]);
      return;
    }

    return {
      ...base,
      type: LayerType.Predefined,
      model,
    };
  }

  private getVectorMetadata(): VectorMetadata | undefined {
    const base = this.getBaseMetadata();
    if (!base) {
      return;
    }

    if (base.type !== LayerType.Vector) {
      logger.error('Invalid layer: ', [this.layer, base]);
      return;
    }

    return {
      ...base,
      type: LayerType.Vector,
    };
  }

  private getWmsMetadata(): WmsMetadata | undefined {
    const base = this.getBaseMetadata();
    if (!base) {
      return;
    }

    const remoteUrls: string[] | undefined = this.layer.get(WmsLayerProperties.Urls);
    const remoteLayerName: string | undefined = this.layer.get(WmsLayerProperties.RemoteLayerName);
    const username: string | undefined = this.layer.get(WmsLayerProperties.Username);
    const password: string | undefined = this.layer.get(WmsLayerProperties.Password);
    const projection: AbcProjection | undefined = this.layer.get(WmsLayerProperties.Projection);
    const extent: [number, number, number, number] | undefined = this.layer.get(WmsLayerProperties.Extent);
    if (base.type !== LayerType.Wms || !remoteUrls || !remoteLayerName) {
      logger.error('Invalid layer: ', [this.layer, base]);
      return;
    }

    const auth = username && password ? { username, password } : undefined;
    return {
      ...base,
      type: LayerType.Wms,
      remoteUrls,
      remoteLayerName,
      auth,
      projection,
      extent,
    };
  }

  private getWmtsMetadata(): WmtsMetadata | undefined {
    const base = this.getBaseMetadata();
    if (!base) {
      return;
    }

    const capabilitiesUrl: string | undefined = this.layer.get(WmtsLayerProperties.CapabilitiesUrl);
    const remoteLayerName: string | undefined = this.layer.get(WmtsLayerProperties.LayerName);
    const username: string | undefined = this.layer.get(WmtsLayerProperties.Username);
    const password: string | undefined = this.layer.get(WmtsLayerProperties.Password);
    if (base.type !== LayerType.Wmts || !capabilitiesUrl || !remoteLayerName) {
      logger.error('Invalid layer : ', [this.layer, base]);
      return;
    }

    const auth = username && password ? { username, password } : undefined;
    return {
      ...base,
      type: LayerType.Wmts,
      capabilitiesUrl,
      remoteLayerName,
      auth,
    };
  }

  private getXyzMetadata(): XyzMetadata | undefined {
    const base = this.getBaseMetadata();
    if (!base) {
      return;
    }

    const remoteUrl: string | undefined = this.layer.get(XyzLayerProperties.Url);
    const projection: AbcProjection | undefined = this.layer.get(XyzLayerProperties.Projection);
    if (base.type !== LayerType.Xyz || !remoteUrl) {
      logger.error('Invalid layer: ', [this.layer, base]);
      return;
    }

    return {
      ...base,
      type: LayerType.Xyz,
      remoteUrl,
      projection,
    };
  }

  public async toAbcLayer(): Promise<AbcLayer> {
    const commonMeta = this.getMetadata();
    if (!commonMeta) {
      return Promise.reject(new Error('Invalid layer'));
    }

    // Predefined layer
    if (this.isPredefined()) {
      const meta = this.getPredefinedMetadata();
      if (!meta) {
        return Promise.reject(new Error('Invalid predefined layer'));
      }
      return {
        type: LayerType.Predefined,
        metadata: meta,
      };
    }

    // Vector layer
    else if (this.isVector()) {
      const meta = this.getVectorMetadata();
      if (!meta) {
        return Promise.reject(new Error('Invalid vector layer'));
      }
      const geoJson = new GeoJSON();
      const source = this.getSource() as VectorSource<Geometry>;
      const features = geoJson.writeFeaturesObject(source.getFeatures());
      return {
        type: LayerType.Vector,
        metadata: meta,
        features,
      };
    }

    // WMS Layer
    else if (this.isWms()) {
      const meta = this.getWmsMetadata();
      if (!meta) {
        return Promise.reject(new Error('Invalid wms layer'));
      }
      return {
        type: LayerType.Wms,
        metadata: meta,
      };
    }

    // WMTS Layer
    else if (this.isWmts()) {
      const meta = this.getWmtsMetadata();
      if (!meta) {
        return Promise.reject(new Error('Invalid wmts layer'));
      }
      return {
        type: LayerType.Wmts,
        metadata: meta,
      };
    }

    // XYZ Layer
    else if (this.isXyz()) {
      const meta = this.getXyzMetadata();
      if (!meta) {
        return Promise.reject(new Error('Invalid wms layer'));
      }
      return {
        type: LayerType.Xyz,
        metadata: meta,
      };
    }

    return Promise.reject(new Error(`Unhandled layer type: ${commonMeta.type}`));
  }
}
