import { Module } from '../Module';
import DataViewerUi from './ui/DataViewerUi';
import { ModuleId } from '../ModuleId';
import React, { ReactNode } from 'react';

export class DataViewer extends Module {
  public getId(): ModuleId {
    return ModuleId.DataViewer;
  }

  public getReadableName(): string {
    return 'Données de couches';
  }

  public getUserInterface(): ReactNode {
    return <DataViewerUi />;
  }
}
