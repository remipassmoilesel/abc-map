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

import React, { useCallback } from 'react';
import { Logger } from '@abc-map/shared';
import { useAppSelector } from '../../../../core/store/hooks';
import Cls from './ProjectStatus.module.scss';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { useServices } from '../../../../core/useServices';
import { ModalStatus } from '../../../../core/ui/typings';

const logger = Logger.get('ProjectStatus.tsx');

interface Props {
  className: string;
}

export function ProjectStatus(props: Props) {
  const { className } = props;
  const { t } = useTranslation('ProjectManagement');
  const { metadata, lastSaveOnline, lastExport } = useAppSelector((st) => st.project);
  const { modals, project, toasts } = useServices();

  const handleEditName = useCallback(() => {
    modals
      .prompt(t('Project_name'), t('Enter_the_new_project_name'), metadata.name, /\w+[\w ]+/gi, t('Incorrect_name'))
      .then(({ status, value }) => {
        if (ModalStatus.Confirmed === status) {
          project.renameProject(value);
        }
      })
      .catch((err) => {
        logger.error('Prompt error: ', err);
        toasts.genericError(err);
      });
  }, [metadata.name, modals, project, t, toasts]);

  return (
    <div className={clsx(className, 'w-100 d-flex flex-column')}>
      <small>{t('Current_project')}</small>

      {/* Project name */}
      <div className={'d-flex'}>
        <h2 className={Cls.name} data-cy="project-name">
          {metadata.name}
        </h2>
        <button onClick={handleEditName} title={t('Edit_project_name')} className={'btn btn-link'} data-cy="edit-project-name">
          <FaIcon icon={IconDefs.faPencilAlt} />
        </button>
      </div>

      {/* Last save */}
      <div className={'mb-3'}>
        {metadata.public && (
          <div>
            {t('Last_online_save')}: {lastSaveOnline ? lastSaveOnline.toFormat('HH:mm') : t('Project_not_saved')}
          </div>
        )}
        {!metadata.public && (
          <div>
            {t('Last_export')}: {lastExport ? lastExport.toFormat('HH:mm') : t('Project_not_saved')}
          </div>
        )}
      </div>
    </div>
  );
}
