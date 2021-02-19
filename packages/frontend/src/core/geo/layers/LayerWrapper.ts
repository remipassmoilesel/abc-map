import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import { Logger } from '../../utils/Logger';
import {
  AbcLayer,
  AbcProjection,
  AbcProperties,
  AbcWmsLayer,
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
} from '@abc-map/shared-entities';
import uuid from 'uuid-random';
import { GeoJSON } from 'ol/format';
import { Encryption } from '../../utils/Encryption';
import BaseLayer from 'ol/layer/Base';
import TileSource from 'ol/source/Tile';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';

export const logger = Logger.get('LayerWrapper');

export declare type OlLayers = VectorLayer | TileLayer;

export class LayerWrapper<Layer extends OlLayers = OlLayers, Meta extends LayerMetadata = LayerMetadata> {
  public static from<Layer extends OlLayers = OlLayers, Meta extends LayerMetadata = LayerMetadata>(layer: Layer): LayerWrapper<Layer, Meta> {
    return new LayerWrapper(layer);
  }

  public static isManaged(layer: BaseLayer): boolean {
    const hasProperty = !!layer.get(AbcProperties.Managed);
    const isSupported = layer instanceof TileLayer || layer instanceof VectorLayer;
    return hasProperty && isSupported;
  }

  constructor(private layer: Layer) {}

  public unwrap(): Layer {
    return this.layer;
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

  public isPredefined(): this is LayerWrapper<TileLayer, PredefinedMetadata> {
    return this.getType() === LayerType.Predefined;
  }

  public isVector(): this is LayerWrapper<VectorLayer, VectorMetadata> {
    return this.getType() === LayerType.Vector;
  }

  public isWms(): this is LayerWrapper<TileLayer, WmsMetadata> {
    return this.getType() === LayerType.Wms;
  }

  /**
   * Shallow clone layer
   */
  public shallowClone(): LayerWrapper<Layer, Meta> {
    // Typings are broken here
    let layer: TileLayer | VectorLayer;
    if (this.isPredefined()) {
      layer = new TileLayer({ source: this.layer.getSource() as TileSource });
    } else if (this.isWms()) {
      layer = new TileLayer({ source: this.layer.getSource() as TileSource });
    } else if (this.isVector()) {
      layer = new VectorLayer({ source: this.layer.getSource() as VectorSource<Geometry> });
    } else {
      throw new Error('Unsupported layer type');
    }

    return LayerWrapper.from<Layer, Meta>(layer as Layer).setMetadata(this.getMetadata() as Meta);
  }

  public setMetadata(props: Meta): LayerWrapper<Layer, Meta> {
    this.layer.set(AbcProperties.Managed, true);
    this.layer.set(LayerProperties.Id, props.id);
    this.layer.set(LayerProperties.Name, props.name);
    this.layer.set(LayerProperties.Type, props.type);
    this.layer.set(LayerProperties.Active, props.active);
    this.layer.setOpacity(props.opacity);
    this.layer.setVisible(props.visible);

    if (LayerType.Predefined === props.type) {
      this.setPredefinedMetadata(props as PredefinedMetadata);
    } else if (LayerType.Wms === props.type) {
      this.setWmsMetadata(props as WmsMetadata);
    }
    return this;
  }

  private setPredefinedMetadata(props: PredefinedMetadata): void {
    this.layer.set(PredefinedLayerProperties.Model, props.model);
  }

  private setWmsMetadata(props: WmsMetadata): void {
    this.layer.set(WmsLayerProperties.Url, props.remoteUrl);
    this.layer.set(WmsLayerProperties.LayerName, props.remoteLayerName);
    this.layer.set(WmsLayerProperties.Username, props.auth?.username);
    this.layer.set(WmsLayerProperties.Password, props.auth?.password);
    this.layer.set(WmsLayerProperties.Projection, props.projection);
    this.layer.set(WmsLayerProperties.Extent, props.extent);
  }

  public getMetadata(): Meta | undefined {
    // Types are buggy here
    if (this.isPredefined()) {
      return this.getPredefinedMetadata() as Meta;
    } else if (this.isVector()) {
      return this.getVectorMetadata() as Meta;
    } else if (this.isWms()) {
      return this.getWmsMetadata() as Meta;
    }
  }

  private getBaseMetadata(): BaseMetadata | undefined {
    const id: string | undefined = this.layer.get(LayerProperties.Id);
    const name: string | undefined = this.layer.get(LayerProperties.Name);
    const type: LayerType | undefined = this.layer.get(LayerProperties.Type);
    const active: boolean | undefined = this.layer.get(LayerProperties.Active);
    const opacity: number | undefined = this.layer.getOpacity();
    const visible: boolean | undefined = this.layer.getVisible();
    if (!id || !name || !type) {
      logger.error('Invalid layer: ', [this.layer, id, name, type]);
      return;
    }

    return {
      id,
      name,
      type,
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

    const remoteUrl: string | undefined = this.layer.get(WmsLayerProperties.Url);
    const remoteLayerName: string | undefined = this.layer.get(WmsLayerProperties.LayerName);
    const username: string | undefined = this.layer.get(WmsLayerProperties.Username);
    const password: string | undefined = this.layer.get(WmsLayerProperties.Password);
    const projection: AbcProjection | undefined = this.layer.get(WmsLayerProperties.Projection);
    const extent: [number, number, number, number] | undefined = this.layer.get(WmsLayerProperties.Extent);
    if (base.type !== LayerType.Wms || !remoteUrl || !remoteLayerName) {
      logger.error('Invalid layer: ', [this.layer, base]);
      return;
    }

    const auth = username && password ? { username, password } : undefined;
    return {
      ...base,
      type: LayerType.Wms,
      remoteUrl,
      remoteLayerName,
      auth,
      projection,
      extent,
    };
  }

  // FIXME: remove usage of password from here, decrypt project before
  public async toAbcLayer(password?: string): Promise<AbcLayer> {
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
      const layer = this.unwrap() as VectorLayer; // Typing is buggy here
      const features = geoJson.writeFeaturesObject(layer.getSource().getFeatures());
      return {
        type: LayerType.Vector,
        metadata: meta,
        features,
      };
    }

    // Wms Layer
    else if (this.isWms()) {
      const meta = this.getWmsMetadata();
      if (!meta) {
        return Promise.reject(new Error('Invalid wms layer'));
      }
      const result: AbcWmsLayer = {
        type: LayerType.Wms,
        metadata: meta,
      };
      if (result.metadata.auth?.username && result.metadata.auth?.password) {
        if (!password) {
          throw new Error('Master password is required, a layer contains credentials');
        }
        result.metadata = await Encryption.encryptWmsMetadata(result.metadata, password);
      }
      return result;
    }

    return Promise.reject(new Error(`Unhandled layer type: ${commonMeta.type}`));
  }
}
