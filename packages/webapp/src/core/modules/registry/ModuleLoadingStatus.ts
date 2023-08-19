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

import { Module } from '@abc-map/module-api';

export enum LoadingStatus {
  Succeed = 'Succeed',
  Failed = 'Failed',
}

export interface ModuleLoadingSucceed {
  status: LoadingStatus.Succeed;
  url: string;
  module: Module;
}

export interface ModuleLoadingFailed {
  status: LoadingStatus.Failed;
  url: string;
  error: string;
  module: undefined;
}

export type ModuleLoadingStatus = ModuleLoadingSucceed | ModuleLoadingFailed;
