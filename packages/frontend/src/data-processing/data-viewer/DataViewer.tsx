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

import { Module } from '../Module';
import DataViewerUi from './ui/DataViewerUi';
import { ModuleId } from '../ModuleId';
import React, { ReactNode } from 'react';

export class DataViewer extends Module {
  private layerId: string | undefined;

  public getId(): ModuleId {
    return ModuleId.DataViewer;
  }

  public getReadableName(): string {
    return 'Tableaux de données';
  }

  public getUserInterface(): ReactNode {
    return <DataViewerUi initialValue={this.layerId} onChange={this.handleLayerChange} />;
  }

  private handleLayerChange = (layerId?: string) => {
    this.layerId = layerId;
  };
}
