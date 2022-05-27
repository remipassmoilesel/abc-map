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

import React, { useState, useEffect, useContext } from 'react';

export const OnlineStatusContext = React.createContext(true);

export const OnlineStatusProvider: React.FC = ({ children }) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(navigator.onLine ?? true);

  useEffect(() => {
    const handleOffline = () => setOnlineStatus(false);
    const handleOnline = () => setOnlineStatus(true);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return <OnlineStatusContext.Provider value={onlineStatus}>{children}</OnlineStatusContext.Provider>;
};

/**
 * Return true if app is currently online
 */
export function useOnlineStatus(): boolean {
  return useContext(OnlineStatusContext);
}

/**
 * Return true if app is currently offline
 */
export function useOfflineStatus(): boolean {
  return !useOnlineStatus();
}
