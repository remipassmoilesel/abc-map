import BaseLayer from 'ol/layer/Base';
import {
  AbcProjection,
  BaseMetadata,
  LayerType,
  PredefinedLayerModel,
  PredefinedMetadata,
  VectorMetadata,
  WmsLayerProperties,
  WmsMetadata,
} from '@abc-map/shared-entities';
import { AbcProperties, LayerProperties, PredefinedLayerProperties } from '@abc-map/shared-entities';
import { Logger } from '../../utils/Logger';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';

export const logger = Logger.get('LayerMetadata.ts');

export class LayerMetadataHelper {
  public static setCommons(layer: BaseLayer, props: BaseMetadata): void {
    layer.set(AbcProperties.Managed, true);
    layer.set(LayerProperties.Id, props.id);
    layer.set(LayerProperties.Name, props.name);
    layer.set(LayerProperties.Type, props.type);
    layer.set(LayerProperties.Active, props.active);
    layer.setOpacity(props.opacity);
    layer.setVisible(props.visible);
  }

  public static getCommons(layer: BaseLayer): BaseMetadata | undefined {
    const id: string | undefined = layer.get(LayerProperties.Id);
    const name: string | undefined = layer.get(LayerProperties.Name);
    const type: LayerType | undefined = layer.get(LayerProperties.Type);
    const active: boolean | undefined = layer.get(LayerProperties.Active);
    const opacity: number | undefined = layer.getOpacity();
    const visible: boolean | undefined = layer.getVisible();
    if (!id || !name || !type) {
      logger.error('Invalid layer: ', [layer, id, name, type]);
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

  public static setPredefinedMetadata(layer: BaseLayer, props: PredefinedMetadata): void {
    this.setCommons(layer, props);
    layer.set(PredefinedLayerProperties.Model, props.model);
  }

  public static getPredefinedMetadata(layer: BaseLayer): PredefinedMetadata | undefined {
    const commons = this.getCommons(layer);
    if (!commons) {
      return;
    }

    const model: PredefinedLayerModel | undefined = layer.get(PredefinedLayerProperties.Model);
    if (commons.type !== LayerType.Predefined || !model) {
      logger.error('Invalid layer: ', [layer, commons, model]);
      return;
    }

    return {
      ...commons,
      type: LayerType.Predefined,
      model,
    };
  }

  public static setVectorMetadata(layer: VectorLayer, props: VectorMetadata): void {
    this.setCommons(layer, props);
  }

  public static getVectorMetadata(layer: BaseLayer): VectorMetadata | undefined {
    const commons = this.getCommons(layer);
    if (!commons) {
      return;
    }

    if (commons.type !== LayerType.Vector) {
      logger.error('Invalid layer: ', [layer, commons]);
      return;
    }

    return {
      ...commons,
      type: LayerType.Vector,
    };
  }

  public static setWmsMetadata(layer: TileLayer, props: WmsMetadata): void {
    this.setCommons(layer, props);
    layer.set(WmsLayerProperties.Url, props.url);
    layer.set(WmsLayerProperties.LayerName, props.layerName);
    layer.set(WmsLayerProperties.Username, props.auth?.username);
    layer.set(WmsLayerProperties.Password, props.auth?.password);
    layer.set(WmsLayerProperties.Projection, props.projection);
    layer.set(WmsLayerProperties.Extent, props.extent);
  }

  public static getWmsMetadata(layer: BaseLayer): WmsMetadata | undefined {
    const commons = this.getCommons(layer);
    if (!commons) {
      return;
    }

    const url: string | undefined = layer.get(WmsLayerProperties.Url);
    const layerName: string | undefined = layer.get(WmsLayerProperties.LayerName);
    const username: string | undefined = layer.get(WmsLayerProperties.Username);
    const password: string | undefined = layer.get(WmsLayerProperties.Password);
    const projection: AbcProjection | undefined = layer.get(WmsLayerProperties.Projection);
    const extent: [number, number, number, number] | undefined = layer.get(WmsLayerProperties.Extent);
    if (commons.type !== LayerType.Wms || !url || !layerName) {
      logger.error('Invalid layer: ', [layer, commons]);
      return;
    }

    const auth = username && password ? { username, password } : undefined;
    return {
      ...commons,
      type: LayerType.Wms,
      url,
      layerName,
      auth,
      projection,
      extent,
    };
  }
}
