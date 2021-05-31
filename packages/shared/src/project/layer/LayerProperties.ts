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

  /**
   * If set, this Openlayers layer is managed by Abc-Map
   */
  Managed = 'abc:layer:managed',

  /**
   * This property is set on layer collection in order to trigger changes
   */
  LastLayerChange = 'abc:layers:last-change',
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

export enum XyzLayerProperties {
  Url = 'abc:layer:xyz:url',
  Projection = 'abc:layer:xyz:projection',
}
