/**
 * Copyright © 2026 Rémi Pace.
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

import type { ModuleRegistry } from './registry/ModuleRegistry';
import { useContext } from 'react';
import { ModuleRegistryContext } from './registry/context';
import { useAppSelector } from '../../store/hooks';
import { ModuleId, Logger } from '@abc-map/shared';
import { matchRoutes, useLocation } from 'react-router-dom';
import { Routes } from '../../routes';
import type { AbcModule } from '../../modules/AbcModule.ts';

const logger = Logger.get('hooks.ts');

export function useModuleRegistry(): ModuleRegistry {
  const contextValue = useContext(ModuleRegistryContext);
  if (!contextValue) {
    throw new Error(`You should not use useModuleRegistry() outside a <ModuleRegistryProvider>`);
  }

  const [registry] = contextValue;

  return registry;
}

export function useActiveModule(): { module: AbcModule | undefined } {
  // We cannot use useMatch() here, this hook can be called from outside a Route element
  // See: https://github.com/remix-run/react-router/issues/7026
  const registry = useModuleRegistry();
  const location = useLocation();
  const params = matchRoutes([{ path: Routes.module().raw() }], location.pathname);

  const moduleId = params && params.length && params[0].params.moduleId;
  const module = moduleId ? registry.getModules().find((module) => module.getId() === moduleId) : undefined;
  return { module };
}

export function useEssentialModules(): AbcModule[] {
  const moduleIds: ModuleId[] = [ModuleId.DataStore, ModuleId.MapExport, ModuleId.SharedMapSettings];

  const registry = useModuleRegistry();
  const modules = registry.getModules();

  return moduleIds
    .map((moduleId) => {
      const module = modules.find((mod) => mod.getId() === moduleId);
      if (!module) logger.warn(`Module not found: ${moduleId}`);
      return module;
    })
    .filter((mod): mod is AbcModule => !!mod);
}

export function useLastModulesUsed(): AbcModule[] {
  const lastModulesUsed = useAppSelector((st) => st.ui.lastModulesUsed);
  const registry = useModuleRegistry();
  const modules = registry.getModules();

  return lastModulesUsed
    .map((moduleId) => {
      const module = modules.find((mod) => mod.getId() === moduleId);
      if (!module) logger.warn(`Module not found: ${moduleId}`);
      return module;
    })
    .filter((mod): mod is AbcModule => !!mod)
    .slice(0, 5);
}

export function useFavoriteModules(): AbcModule[] {
  const moduleIds = useAppSelector((st) => st.ui.favoriteModules);
  const registry = useModuleRegistry();
  const modules = registry.getModules();

  return moduleIds
    .map((moduleId) => {
      const module = modules.find((mod) => mod.getId() === moduleId);
      if (!module) logger.warn(`Module not found: ${moduleId}`);
      return module;
    })
    .filter((mod): mod is AbcModule => !!mod);
}
