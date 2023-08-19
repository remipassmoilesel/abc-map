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

import { useServices } from '../useServices';
import { ProjectStatus } from './ProjectStatus';
import { prefixedTranslation } from '../../i18n/i18n';
import { resolveInAtLeast } from '../utils/resolveInAtLeast';
import { useAppDispatch } from '../store/hooks';
import { ProjectActions } from '../store/project/actions';
import { DateTime } from 'luxon';

const t = prefixedTranslation('useSaveProjectOnline:');

export function useSaveProjectOnline(): () => Promise<ProjectStatus> {
  const { project, toasts } = useServices();
  const dispatch = useAppDispatch();

  return () => {
    const previousToast = toasts.info(t('Saving'));
    return resolveInAtLeast(project.saveCurrent(), 800)
      .then<ProjectStatus>((status) => {
        toasts.dismiss(previousToast);
        switch (status) {
          case ProjectStatus.OnlineQuotaExceeded:
            toasts.tooMuchProjectError();
            return status;

          case ProjectStatus.TooHeavy:
            toasts.error(t('Project_too_heavy'));
            return status;

          case ProjectStatus.Canceled:
            return status;

          case ProjectStatus.Ok:
            toasts.info(t('Project_saved'));
            return status;
        }
      })
      .catch((err) => {
        toasts.genericError();
        return Promise.reject(err);
      })
      .finally(() => dispatch(ProjectActions.setLastSaveOnline(DateTime.now())));
  };
}
