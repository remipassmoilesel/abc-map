/**
 * Copyright © 2023 Rémi Pace.
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

import { DataPropertiesMap, FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { AbcProjection, FeatureStyle } from '@abc-map/shared';
import { asNumberOrString } from '../../../core/utils/numbers';
import { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { GeoJSON } from 'ol/format';

const geojson = new GeoJSON();

export class ScriptFeature {
  private innerFeature: FeatureWrapper;

  constructor(feature: Feature<Geometry>, private projection?: AbcProjection) {
    this.innerFeature = FeatureWrapper.from(feature);
  }

  public getProperties(): DataPropertiesMap {
    const properties = this.innerFeature.getDataProperties();

    const result: DataPropertiesMap = {};
    for (const key in properties) {
      const property = properties[key];

      // We cast number values like '1,000' or '1 000'
      result[key] = asNumberOrString(property);
    }

    return result;
  }

  public setProperties(properties: DataPropertiesMap): void {
    this.innerFeature.setDataProperties(properties);
  }

  public getGeometry(): GeoJSONGeometry | undefined {
    const geometry = this.innerFeature.getGeometry();
    return geometry ? geojson.writeGeometryObject(geometry, { dataProjection: 'EPSG:4326', featureProjection: this.projection?.name }) : undefined;
  }

  public setGeometry(geometry: GeoJSONGeometry): void {
    this.innerFeature.unwrap().setGeometry(geojson.readGeometry(geometry, { featureProjection: this.projection?.name, dataProjection: 'EPSG:4326' }));
  }

  public getStyle(): FeatureStyle {
    return this.innerFeature.getStyleProperties();
  }

  public setStyle(style: FeatureStyle): void {
    this.innerFeature.setStyleProperties(style);
  }

  public unwrap(): Feature<Geometry> {
    return this.innerFeature.unwrap();
  }
}
