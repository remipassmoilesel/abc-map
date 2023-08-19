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

import { SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import {
  AttributionFormat,
  LayerType,
  LayerWrapper,
  OlLayers,
  OlSources,
  PredefinedLayerWrapper,
  VectorLayerWrapper,
  WmsLayerWrapper,
  WmtsLayerWrapper,
  XyzLayerWrapper,
} from '../layers/LayerWrapper';
import { AbcProjection } from '../map/AbcProjection';

/**
 * Initialize a new layer wrapper stub. Based on sinonjs, see: https://sinonjs.org/releases/latest/stubs/
 */
export function newTestLayerWrapper(): SinonStubbedInstance<LayerWrapper> {
  return sinon.createStubInstance(DumbLayerWrapper);
}

/* eslint-disable */
export class DumbLayerWrapper implements LayerWrapper {
  getAttributions(format: AttributionFormat): string[] | undefined {
    return {} as any;
  }

  getId(): string | undefined {
    return {} as any;
  }

  getName(): string | undefined {
    return {} as any;
  }

  getOpacity(): number {
    return {} as any;
  }

  getProjection(): AbcProjection | undefined {
    return {} as any;
  }

  getSource(): OlSources {
    return {} as any;
  }

  getType(): LayerType | undefined {
    return {} as any;
  }

  isActive(): boolean {
    return {} as any;
  }

  isPredefined(): this is PredefinedLayerWrapper {
    return {} as any;
  }

  isVector(): this is VectorLayerWrapper {
    return {} as any;
  }

  isVisible(): boolean {
    return {} as any;
  }

  isWms(): this is WmsLayerWrapper {
    return {} as any;
  }

  isWmts(): this is WmtsLayerWrapper {
    return {} as any;
  }

  isXyz(): this is XyzLayerWrapper {
    return {} as any;
  }

  setActive(value: boolean): LayerWrapper {
    return {} as any;
  }

  setAttributions(attr: string[]): LayerWrapper<OlLayers, OlSources> {
    return {} as any;
  }

  setId(value?: string): LayerWrapper {
    return {} as any;
  }

  setName(value: string): LayerWrapper {
    return {} as any;
  }

  setOpacity(value: number): LayerWrapper {
    return {} as any;
  }

  setVisible(value: boolean): LayerWrapper {
    return {} as any;
  }

  unwrap(): OlLayers {
    return {} as any;
  }
}
/* eslint-enable */
