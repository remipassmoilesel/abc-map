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

import { useTranslation } from 'react-i18next';
import { useServices } from '../useServices';
import { ModalStatus } from '../ui/typings';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('useCreateNewProject.ts');

export function useCreateNewProject(): () => Promise<void> {
  const { t } = useTranslation('useCreateNewProject');
  const { modals, toasts, project } = useServices();

  return () => {
    return modals
      .modificationsLostConfirmation()
      .then((res) => {
        if (ModalStatus.Confirmed === res) {
          return project.newProject().then(() => toasts.info(t('New_project_created')));
        }
      })
      .then(() => undefined)
      .catch((err) => logger.error('Confirmation error: ', err));
  };
}
