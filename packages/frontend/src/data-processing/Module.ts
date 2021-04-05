import { ReactNode } from 'react';
import { ModuleId } from './ModuleId';

export abstract class Module {
  public abstract getId(): ModuleId;
  public abstract getReadableName(): string;
  public abstract getUserInterface(): ReactNode;
}
