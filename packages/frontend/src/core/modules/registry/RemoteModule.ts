/**
 * Copyright © 2022 Rémi Pace.
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

export interface RemoteModule extends Module {
  getSourceUrl(): string;
}

export function isRemoteModule(mod: Module): mod is RemoteModule {
  return mod && !!(mod as RemoteModule).getSourceUrl;
}

export class RemoteModuleWrapper implements RemoteModule {
  constructor(private module: Module, private sourceUrl: string) {}

  public getId(): string {
    return this.module.getId();
  }

  public getReadableName(): string {
    return this.module.getReadableName();
  }

  public getShortDescription(): string {
    return this.module.getShortDescription();
  }

  public getView() {
    return this.module.getView();
  }

  public getSourceUrl() {
    return this.sourceUrl;
  }
}
