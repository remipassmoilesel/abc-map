import { ReactNode } from 'react';
import { Module } from '../Module';
import DifferentSymbolsUi from './ui/DifferentSymbolsUi';
import { ModuleId } from '../ModuleId';

export class DifferentSymbols extends Module {
  public getId(): ModuleId {
    return ModuleId.DifferentSymbols;
  }

  public getReadableName(): string {
    return 'Symboles différents';
  }

  public getUserInterface(): ReactNode {
    return <DifferentSymbolsUi />;
  }
}
