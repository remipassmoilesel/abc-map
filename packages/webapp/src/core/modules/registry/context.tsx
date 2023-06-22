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

import * as React from 'react';
import { ModuleRegistry } from './ModuleRegistry';
import { ReactNode, useEffect, useState } from 'react';

export const ModuleRegistryContext = React.createContext<[ModuleRegistry, string[]] | false>(false);

interface Props {
  value: ModuleRegistry;
  children: ReactNode | ReactNode[];
}

export function ModuleRegistryProvider(props: Props) {
  const { children, value: registry } = props;
  const [moduleIds, setModuleIds] = useState<string[]>([]);

  // Every time there is a change in registry we trigger a context change to render
  useEffect(() => {
    const handleChange = () => {
      setModuleIds(registry.getModules().map((m) => m.getId()));
    };

    registry.addEventListener(handleChange);
    return () => registry.removeEventListener(handleChange);
  }, [registry]);

  return <ModuleRegistryContext.Provider value={[registry, moduleIds]}>{children}</ModuleRegistryContext.Provider>;
}
