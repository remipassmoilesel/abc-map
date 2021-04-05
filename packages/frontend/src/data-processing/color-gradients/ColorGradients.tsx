import { ReactNode } from 'react';
import { Module } from '../Module';
import ColorGradientsUi from './ui/ColorGradientsUi';
import { ModuleId } from '../ModuleId';

export class ColorGradients extends Module {
  public getId(): ModuleId {
    return ModuleId.ColorGradients;
  }

  public getReadableName(): string {
    return 'Dégradés de couleurs';
  }

  public getUserInterface(): ReactNode {
    return <ColorGradientsUi />;
  }
}
