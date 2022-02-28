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

import { Module } from './Module';
import { DataViewer } from './data-viewer/DataViewer';
import { ProportionalSymbols } from './proportional-symbols/ProportionalSymbols';
import { DifferentSymbols } from './different-symbols/DifferentSymbols';
import { ColorGradients } from './color-gradients/ColorGradients';
import { getServices } from '../core/Services';
import { Scripts } from './scripts/Scripts';
import { FeatureCountByGeometries } from './count-by-geometries/FeatureCountByGeometries';
import { isExperimentalFeatureEnabled } from '../core/ui/useExperimentalFeature';
import { ArtefactGenerator } from '../experimental-features';
import { ArtefactGenerator as ArtefactGeneratorModule } from './artefact-generator/ArtefactGenerator';

export function getModules(): Module[] {
  const services = getServices();
  const modules = [
    new DataViewer(),
    new ColorGradients(services),
    new ProportionalSymbols(services),
    new DifferentSymbols(),
    new FeatureCountByGeometries(),
    new Scripts(services),
  ];

  if (isExperimentalFeatureEnabled(ArtefactGenerator)) {
    modules.push(ArtefactGeneratorModule.create(services));
  }

  return modules;
}
