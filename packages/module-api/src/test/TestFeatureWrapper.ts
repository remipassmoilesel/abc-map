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

import Feature from 'ol/Feature';
import { SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import { FeatureStyle } from '../features/FeatureStyle';
import { FeatureWrapper, OlGeometry, PropertiesMap, DataPropertiesMap } from '../features/FeatureWrapper';

/**
 * Initialize a new feature wrapper stub. Based on sinonjs, see: https://sinonjs.org/releases/latest/stubs/
 */
export function newTestFeatureWrapper(): SinonStubbedInstance<FeatureWrapper> {
  const stub = sinon.createStubInstance(DumbFeatureWrapper);
  stub.setDataProperties.returns(stub);
  stub.setDefaultStyle.returns(stub);
  stub.setId.returns(stub);
  stub.setProperties.returns(stub);
  stub.setSelected.returns(stub);
  stub.setStyleProperties.returns(stub);
  stub.setText.returns(stub);
  return stub;
}

/* eslint-disable */
class DumbFeatureWrapper implements FeatureWrapper {
  public clone(): FeatureWrapper {
    return {} as any;
  }

  public getAllProperties(): PropertiesMap {
    return {} as any;
  }

  public getGeometry(): OlGeometry | undefined {
    return {} as any;
  }

  public getId(): string | number | undefined {
    return {} as any;
  }

  public getDataProperties(): DataPropertiesMap {
    return {} as any;
  }

  public getStyleProperties(): FeatureStyle {
    return {} as any;
  }

  public getText(): string | undefined {
    return {} as any;
  }

  public hasGeometry(...geoms: string[]): boolean {
    return {} as any;
  }

  public isSelected(): boolean {
    return {} as any;
  }

  public setDataProperties(properties: DataPropertiesMap): FeatureWrapper {
    return {} as any;
  }

  public setDefaultStyle(): FeatureWrapper {
    return {} as any;
  }

  public setId(id?: string | number): FeatureWrapper {
    return {} as any;
  }

  public setProperties(properties: DataPropertiesMap): FeatureWrapper {
    return {} as any;
  }

  public setSelected(value: boolean): FeatureWrapper {
    return {} as any;
  }

  public setStyleProperties(properties: FeatureStyle): FeatureWrapper {
    return {} as any;
  }

  public setText(text: string): FeatureWrapper {
    return {} as any;
  }

  public unwrap(): Feature<OlGeometry> {
    return {} as any;
  }
}
/* eslint-enable */
