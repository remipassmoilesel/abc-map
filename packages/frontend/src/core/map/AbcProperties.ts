/**
 * <p>Openlayers property keys that belong to Abc-Map</p>
 */
export enum AbcProperties {
  /**
   * If set, this Openlayers object belong to Abc-Map
   */
  Managed = 'abc:managed',

  /**
   * <p>
   * This property is set on layer collection, with the ID of the last layer selected.
   * </p>
   *
   * <p>
   * It is used in order to trigger changes after selection, to find the current active layer
   * please use instead LayerProperties.Active.
   * </p>
   */
  LastLayerActive = 'abc:layers:active',

  CurrentTool = 'abc:map:current-tool',
}

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
