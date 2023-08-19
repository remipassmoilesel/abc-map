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

import { PredefinedLayerWrapper, VectorLayerWrapper, WmsLayerWrapper, WmtsLayerWrapper, XyzLayerWrapper } from './LayerWrapper';
import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector';
import { PredefinedLayerModel } from './PredefinedLayerModel';
import { AbcProjection } from '../map';
import { Options as WmtsSourceOptions } from 'ol/source/WMTS';
import { BasicAuthentication } from '../utils';

export type LayerFactory = {
  newPredefinedLayer(model: PredefinedLayerModel): PredefinedLayerWrapper;
  newVectorLayer(source?: VectorSource<Geometry>): VectorLayerWrapper;
  newWmsLayer(settings: WmsSettings): WmsLayerWrapper;
  newWmtsLayer(settings: WmtsSettings): WmtsLayerWrapper;
  newXyzLayer(url: string, projection?: AbcProjection): XyzLayerWrapper;
};

export interface WmsSettings {
  capabilitiesUrl?: string;
  remoteUrls: string[];
  remoteLayerName: string;
  projection?: AbcProjection;
  extent?: [number, number, number, number];
  auth?: BasicAuthentication;
}

export interface WmtsSettings {
  capabilitiesUrl: string;
  remoteLayerName: string;
  sourceOptions?: WmtsSourceOptions;
  auth?: BasicAuthentication;
}
