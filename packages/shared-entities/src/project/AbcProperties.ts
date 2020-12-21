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
