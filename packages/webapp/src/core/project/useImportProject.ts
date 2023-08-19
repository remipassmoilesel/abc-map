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

import { FileIO, InputResultType, InputType } from '../utils/FileIO';
import { ModalStatus, OperationStatus } from '../ui/typings';
import { Errors } from '../utils/Errors';
import { useServices } from '../useServices';
import { Logger, ProjectConstants } from '@abc-map/shared';
import { useTranslation } from 'react-i18next';

const logger = Logger.get('useImportProject.ts');

export function useImportProject(): () => void {
  const { t } = useTranslation('useImportProject');
  const { toasts, project, modals } = useServices();

  return () => {
    const selectProject = async (): Promise<File | undefined> => {
      const result = await FileIO.openPrompt(InputType.Single, ProjectConstants.InputFileExtensions);

      if (InputResultType.Canceled === result.type) {
        return;
      }

      if (result.files.length !== 1) {
        toasts.error(t('You_must_select_a_file'));
        return;
      }

      const file = result.files[0];
      if (!file.name.endsWith(ProjectConstants.FileExtension)) {
        toasts.error(t('You_must_select_a_file_with_extension_', { extension: ProjectConstants.FileExtension }));
        return;
      }

      return file;
    };

    const importProject = async (file: File) => {
      await project.loadBlobProject(file);
      toasts.info(t('Project_loaded'));

      return OperationStatus.Succeed;
    };

    let firstToast = '';
    modals
      .modificationsLostConfirmation()
      .then((res) => {
        if (ModalStatus.Confirmed === res) {
          return selectProject();
        }
      })
      .then((file) => {
        if (file) {
          firstToast = toasts.info(t('Opening_in_progress'));
          return importProject(file);
        }
      })
      .catch((err) => {
        logger.error('Cannot import project: ', err);

        if (Errors.isWrongPassword(err)) {
          toasts.error(t('Incorrect_password'));
        } else if (Errors.isMissingPassword(err)) {
          toasts.error(t('Password_is_mandatory'));
        } else {
          toasts.genericError();
        }
      })
      .finally(() => toasts.dismiss(firstToast));
  };
}
