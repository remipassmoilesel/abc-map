/**
 * Copyright © 2023 Rémi Pace.
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

import { DataTableModule } from './data-table/DataTableModule';
import { ColorGradientsModule } from './color-gradients/ColorGradientsModule';
import { ProportionalSymbolsModule } from './proportional-symbols/ProportionalSymbolsModule';
import { DifferentSymbolsModule } from './different-symbols/DifferentSymbolsModule';
import { FeatureCountByGeometriesModule } from './count-by-geometries/FeatureCountByGeometriesModule';
import { ScriptsModule } from './scripts/ScriptsModule';
import { Module } from '@abc-map/module-api';
import { Services } from '../core/Services';
import { isExperimentalFeatureEnabled } from '../core/ui/useExperimentalFeature';
import { ArtefactGenerator } from '../experimental-features';
import { ArtefactGeneratorModule } from './artefact-generator/ArtefactGeneratorModule';
import { DataStoreModule } from './data-store/DataStoreModule';
import { MapExport } from './map-export/MapExport';
import { SharedMapSettings } from './shared-map-settings/SharedMapSettings';
import { ProjectManagement } from './projects/ProjectManagement';
import { DocumentationModule } from './documentation/DocumentationModule';
import { LayerExport } from './layer-export/LayerExport';

export function bundledModulesFactory(services: Services): Module[] {
  const modules: Module[] = [
    new ColorGradientsModule(services),
    new DataStoreModule(),
    new DataTableModule(),
    new DifferentSymbolsModule(),
    new FeatureCountByGeometriesModule(),
    new ProjectManagement(),
    new ProportionalSymbolsModule(services),
    new ScriptsModule(),
    new SharedMapSettings(),
    new MapExport(),
    new DocumentationModule(),
    new LayerExport(),
  ];

  // Add experimental modules
  if (isExperimentalFeatureEnabled(ArtefactGenerator)) {
    modules.push(ArtefactGeneratorModule.create(services));
  }

  return modules;
}
