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

import React, { useState, useEffect, useContext, ReactNode } from 'react';
import { useServices } from '../useServices';

/**
 * If true, app can be installed as a progressive web app
 */
export const PwaInstallReadinessContext = React.createContext(false);

interface Props {
  children: ReactNode | ReactNode[];
}

export function PwaInstallPromptProvider(props: Props) {
  const { children } = props;
  const { pwa } = useServices();
  const [beforeInstall, setBeforeInstall] = useState<boolean>(pwa.isInstallationReady());

  useEffect(() => {
    const handleBeforeInstall = () => setBeforeInstall(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  return <PwaInstallReadinessContext.Provider value={beforeInstall}>{children}</PwaInstallReadinessContext.Provider>;
}

/**
 * If true, app can be installed as a progressive web app
 */
export function usePwaInstallReadiness(): boolean {
  return useContext(PwaInstallReadinessContext);
}
