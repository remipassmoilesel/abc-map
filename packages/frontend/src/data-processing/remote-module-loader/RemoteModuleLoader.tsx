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

import { Module, ModuleId } from '@abc-map/module-api';
import React from 'react';
import { Services } from '../../core/Services';
import { Logger } from '@abc-map/shared';
import { RemoteModuleLoaderUI } from './ui/RemoteModuleLoaderUI';
import { MainStore } from '../../core/store/store';
import { LocalModuleId } from '../LocalModuleId';
import { prefixedTranslation } from '../../i18n/i18n';
import { ModuleLoadingStatus } from '../ModuleLoadingStatus';

const t = prefixedTranslation('DataProcessingModules:RemoteModuleLoader.');

export const logger = Logger.get('RemoteModuleLoader.tsx', 'info');

export class RemoteModuleLoader implements Module {
  constructor(private services: Services, private store: MainStore, private onLoad: () => Promise<ModuleLoadingStatus[]>) {}

  public getId(): ModuleId {
    return LocalModuleId.RemoteModuleLoader;
  }

  public getReadableName(): string {
    return t('Load_a_module');
  }

  public getUserInterface() {
    return <RemoteModuleLoaderUI onProcess={this.onLoad} />;
  }
}
