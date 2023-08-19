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
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useEffect } from 'react';
import { Logger } from '@abc-map/shared';
import { UiActions } from '../store/ui/actions';

const logger = Logger.get('useServiceWorker.ts');

interface Result {
  present: boolean;
  installed: boolean;
  updateAvailable: boolean;
  error: unknown;
}

export function useServiceWorker(): Result {
  const { present, installed, updateAvailable, error } = useAppSelector((st) => st.ui.serviceWorker);
  const dispatch = useAppDispatch();

  // We check is SW is present
  useEffect(() => {
    if (present) {
      return;
    }

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => dispatch(UiActions.setServiceWorkerState({ present: !!registrations.length })))
      .catch((err) => logger.error('Service worker list error: ', err));
  }, [dispatch, present]);

  return {
    present,
    installed,
    updateAvailable,
    error,
  };
}
