/**
 * <p>Openlayers property keys that belong to Abc-Map</p>
 */
export enum AbcProperties {
  /**
   * If set, this Openlayers object belong to Abc-Map
   */
  Managed = 'abc:managed',

  /**
   * This property is set on layer collection in order to trigger changes
   */
  LastLayerChange = 'abc:layers:last-change',

  CurrentTool = 'abc:map:current-tool',
}
