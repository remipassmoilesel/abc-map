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
