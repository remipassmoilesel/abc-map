/**
 * These properties are set on map layers that are managed by Abc-Map
 */
export enum LayerProperties {
  /**
   * Unique identifier of layer
   */
  Id = 'abc:layer:id',

  /**
   * Readable name of layer
   */
  Name = 'abc:layer:name',

  /**
   * If true, user modifications are applied on this layer
   */
  Active = 'abc:layer:active',

  /**
   * Type of layer
   */
  Type = 'abc:layer:type',
}

/**
 * These properties are set on map layers, but are specific to predefined layers
 */
export enum PredefinedLayerProperties {
  /**
   * Contains layer model, for persistence
   */
  Model = 'abc:layer:predefined:model',
}

export enum WmsLayerProperties {
  Url = 'abc:layer:wms:url',
  LayerName = 'abc:layer:wms:layer-name',
  Username = 'abc:layer:wms:username',
  Password = 'abc:layer:wms:password',
  Projection = 'abc:layer:wms:projection',
  Extent = 'abc:layer:wms:extent',
}
