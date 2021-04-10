import { Module } from './Module';
import { DataViewer } from './data-viewer/DataViewer';
import { ProportionalSymbols } from './proportional-symbols/ProportionalSymbols';
import { DifferentSymbols } from './different-symbols/DifferentSymbols';
import { ColorGradients } from './color-gradients/ColorGradients';
import { getServices } from '../core/Services';
import { Scripts } from './scripts/Scripts';

export function getModules(): Module[] {
  const services = getServices();
  return [new DataViewer(), new ProportionalSymbols(services), new DifferentSymbols(), new ColorGradients(), new Scripts(services)];
}
