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

import { FeatureWrapperFactory } from './features';
import { LayerFactory } from './layers';
import { MapFactory, MapWrapper } from './map';
import { GeoService } from './services/GeoService';
import { HistoryService } from './services';
import { ChangesetFactories } from './services/ChangesetFactories';
import { ModalService } from './services/ModalService';

/**
 *
 * All interfaces will have an implementation injected at runtime in global scope of modules.
 *
 * You can't rename or remove things from this interface.
 */
export interface ModuleApi {
  resourceBaseUrl: string;
  FeatureWrapperFactory: FeatureWrapperFactory;
  LayerFactory: LayerFactory;
  MapFactory: MapFactory;
  changesets: ChangesetFactories;
  mainMap: MapWrapper;
  services: {
    geo: GeoService;
    history: HistoryService;
    modals: ModalService;
  };
}
