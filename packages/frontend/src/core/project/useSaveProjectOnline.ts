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

import { useServices } from '../useServices';
import { ProjectStatus } from './ProjectStatus';
import { prefixedTranslation } from '../../i18n/i18n';
import { OperationStatus } from '../ui/typings';
import { Services } from '../Services';

const t = prefixedTranslation('core:useSaveProjectOnline.');

export async function saveProjectOnline(services: Services): Promise<ProjectStatus> {
  const { project, toasts, modals } = services;

  const save = (): Promise<[OperationStatus, ProjectStatus]> =>
    project
      .saveCurrent()
      .then<[OperationStatus, ProjectStatus]>((status) => {
        switch (status) {
          case ProjectStatus.OnlineQuotaExceeded:
            toasts.error(t('Too_much_projects'));
            return [OperationStatus.Interrupted, status];

          case ProjectStatus.TooHeavy:
            toasts.error(t('Project_too_heavy'));
            return [OperationStatus.Interrupted, status];

          case ProjectStatus.Canceled:
            return [OperationStatus.Interrupted, status];

          case ProjectStatus.Ok:
            toasts.info(t('Project_saved'));
            return [OperationStatus.Succeed, status];
        }
      })
      .catch((err) => {
        toasts.genericError();
        return Promise.reject(err);
      });

  return modals.longOperationModal<ProjectStatus>(save).then((res) => res as ProjectStatus);
}

export function useSaveProjectOnline(): () => Promise<ProjectStatus> {
  const services = useServices();
  return () => saveProjectOnline(services);
}
