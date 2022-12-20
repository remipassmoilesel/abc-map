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

import { ModuleRegistry } from './registry/ModuleRegistry';
import { useContext } from 'react';
import { ModuleRegistryContext } from './registry/context';
import { Logger, Module, ModuleId } from '@abc-map/module-api';
import { useAppSelector } from '../../core/store/hooks';
import { LocalModuleId } from '../../modules/LocalModuleId';

const logger = Logger.get('hooks.ts');

export function useModuleRegistry(): ModuleRegistry {
  const contextValue = useContext(ModuleRegistryContext);
  if (!contextValue) {
    throw new Error(`You should not use useModuleRegistry() outside a <ModuleRegistryProvider>`);
  }

  const [registry] = contextValue;

  return registry;
}

export function useEssentialModules(): Module[] {
  const moduleIds: ModuleId[] = [LocalModuleId.DataStore, LocalModuleId.StaticExport, LocalModuleId.SharedMapSettings];

  const registry = useModuleRegistry();
  const modules = registry.getModules();

  return moduleIds
    .map((moduleId) => {
      const module = modules.find((mod) => mod.getId() === moduleId);
      !module && logger.warn(`Module not found: ${moduleId}`);
      return module;
    })
    .filter((mod): mod is Module => !!mod);
}

export function useLastModulesUsed(): Module[] {
  const lastModulesUsed = useAppSelector((st) => st.ui.lastModulesUsed);
  const registry = useModuleRegistry();
  const modules = registry.getModules();

  return lastModulesUsed
    .map((moduleId) => {
      const module = modules.find((mod) => mod.getId() === moduleId);
      !module && logger.warn(`Module not found: ${moduleId}`);
      return module;
    })
    .filter((mod): mod is Module => !!mod)
    .slice(0, 5);
}

export function useFavoriteModules(): Module[] {
  const moduleIds = useAppSelector((st) => st.ui.favoriteModules);
  const registry = useModuleRegistry();
  const modules = registry.getModules();

  return moduleIds
    .map((moduleId) => {
      const module = modules.find((mod) => mod.getId() === moduleId);
      !module && logger.warn(`Module not found: ${moduleId}`);
      return module;
    })
    .filter((mod): mod is Module => !!mod);
}
