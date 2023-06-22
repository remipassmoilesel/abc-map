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

import { Logger } from '@abc-map/shared';
import { useServices } from '../useServices';
import { useEffect, useState } from 'react';

const logger = Logger.get('useFullscreen.ts');

interface Result {
  fullscreen: boolean;
  toggleFullscreen: () => Promise<boolean>;
}

export function useFullscreen(): Result {
  const { toasts } = useServices();
  const [fullscreen, setFullscreen] = useState<boolean>(!!document.fullscreenElement);

  useEffect(() => {
    const listener = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', listener);
    return () => document.removeEventListener('fullscreenchange', listener);
  }, []);

  function toggleFullscreen(): Promise<boolean> {
    // Not in fullscreen, we enable it
    if (!document.fullscreenElement) {
      return document.body
        .requestFullscreen()
        .then(() => true)
        .catch((err) => {
          toasts.genericError();
          return Promise.reject(err);
        });
    }

    // Already in fullscreen, we disable it
    else {
      return document
        .exitFullscreen()
        .then(() => false)
        .catch((err) => {
          toasts.genericError();
          return Promise.reject(err);
        });
    }
  }

  return {
    fullscreen,
    toggleFullscreen,
  };
}
