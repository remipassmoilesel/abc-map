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

import { ProjectStatus } from './ProjectStatus';
import { FileIO } from '../utils/FileIO';
import { useServices } from '../useServices';
import { Logger, ProjectConstants } from '@abc-map/shared';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../store/hooks';
import { ProjectActions } from '../store/project/actions';
import { DateTime } from 'luxon';

const logger = Logger.get('useExportProject.ts');

export function useExportProject(): () => Promise<void> {
  const { t } = useTranslation('useExportProject');
  const { toasts, project, modals } = useServices();
  const dispatch = useAppDispatch();

  return async () => {
    const firstToast = toasts.info(t('Export_in_progress'));

    try {
      // We export current project. User can cancel operation.
      const compressed = await project.exportAndZipCurrentProject();
      if (ProjectStatus.Canceled === compressed) {
        return;
      }

      // Then we download project and sollicitate pity
      FileIO.downloadBlob(compressed.project, `project${ProjectConstants.FileExtension}`);
      toasts.dismiss(firstToast);
      toasts.info(t('Export_done'));
      dispatch(ProjectActions.setLastExport(DateTime.now()));
      await modals.solicitation();
    } catch (err) {
      logger.error('Cannot export project: ', err);
      toasts.dismiss(firstToast);
      toasts.genericError();
    }
  };
}
