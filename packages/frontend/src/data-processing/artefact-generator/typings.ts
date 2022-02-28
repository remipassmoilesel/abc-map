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

import { AbcView, LayerAuthentication, LayerType } from '@abc-map/shared';
import { I18nText, Language } from '@abc-map/shared';

export interface Parameters {
  type: LayerType;
  name: I18nText[];
  provider: string;
  description: I18nText[];
  license: string;
  attributions: string;
  auth?: LayerAuthentication;
  keywords: I18nText[];
  link: string;
  wms: {
    // Capabilities URL
    url: string;
  };
  wmts: {
    // Capabilities URL
    url: string;
  };
  xyz: {
    // Main URL
    url: string;
  };
  // Create previews
  previews: {
    enabled: boolean;
    views: AbcView[];
  };
  layerIndexes: {
    offset: number;
    limit: number;
  };
}

export function newParameters(): Parameters {
  return {
    type: LayerType.Xyz,
    name: [
      { language: Language.French, text: '' },
      { language: Language.English, text: '' },
    ],
    provider: '',
    description: [
      { language: Language.French, text: '' },
      { language: Language.English, text: '' },
    ],
    license: '',
    attributions: '',
    keywords: [
      { language: Language.French, text: '' },
      { language: Language.English, text: '' },
    ],
    link: '',
    wms: {
      url: '',
    },
    wmts: {
      url: '',
    },
    xyz: {
      url: '',
    },
    previews: {
      enabled: true,
      views: defaultPreviewViews(),
    },
    layerIndexes: {
      offset: -1,
      limit: -1,
    },
  };
}

export interface ExportProgress {
  total: number;
  done: number;
}

export type ProgressHandler = (progress: ExportProgress) => void;

export function defaultPreviewViews() {
  return [
    { center: [255127.43458646, 5854183.083256814], resolution: 2500, projection: { name: 'EPSG:3857' } },
    { center: [-516837.321601631, 6144242.706693536], resolution: 125, projection: { name: 'EPSG:3857' } },
    { center: [-501363.481609926, 6170022.999313944], resolution: 10, projection: { name: 'EPSG:3857' } },
  ];
}
