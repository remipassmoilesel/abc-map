/**
 * <p>Openlayers property keys that belong to Abc-Map</p>
 */
export enum AbcProperties {
  /**
   * If set, this Openlayers object belong to Abc-Map
   */
  Managed = 'abc:managed',
}

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
   * Type of layer
   */
  Type = 'abc:layer:type',
}

export enum PredefinedLayerProperties {
  Model = 'abc:layer:predefined:model',
}
