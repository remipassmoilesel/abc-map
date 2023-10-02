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

import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import bufferExample from './buffer.js-txt';
import classificationExample from './classification.js-txt';
import labelsExample from './labels.js-txt';
import { setupBufferSampleData, setupFranceRegions } from './data';

export interface ScriptExample {
  id: string;
  i18n_key: string;
  codeUrl: string;
  setup: (map: MapWrapper) => Promise<void>;
}

export const Labels: ScriptExample = {
  id: 'labels',
  i18n_key: 'Labels',
  codeUrl: labelsExample,
  setup: async (map) => setupFranceRegions(map),
};

export const Classification: ScriptExample = {
  id: 'classification',
  i18n_key: 'Classification',
  codeUrl: classificationExample,
  setup: async (map) => setupFranceRegions(map),
};

export const Buffers: ScriptExample = {
  id: 'buffers',
  i18n_key: 'Buffers',
  codeUrl: bufferExample,
  setup: async (map) => setupBufferSampleData(map),
};

export const AllScriptExamples = [Labels, Classification, Buffers];
