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
import { IconDefs } from '../../icon/IconDefs';
import { useIsUserAuthenticated } from '../../../core/authentication/useIsUserAuthenticated';
import { useTranslation } from 'react-i18next';
import { useCreateNewProject } from '../../../core/project/useCreateNewProject';
import { useExportProject } from '../../../core/project/useExportProject';
import { useSaveProjectOnline } from '../../../core/project/useSaveProjectOnline';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../../routes';
import { BundledModuleId } from '@abc-map/shared';
import clsx from 'clsx';
import Cls from './ProjectSection.module.scss';
import { useImportProject } from '../../../core/project/useImportProject';
import { ActionButton } from '../action-button/ActionButton';

const logger = Logger.get('ProjectSection.tsx');

interface Props {
  onToggleMenu: () => void;
}

export function ProjectSection(props: Props) {
  const { t } = useTranslation('TopBar');
  const { onToggleMenu: toggleMenu } = props;
  const userAuthenticated = useIsUserAuthenticated();
  const handleCreateNewProject = useCreateNewProject();
  const handleImportProject = useImportProject();
  const exportProject = useExportProject();
  const handleSaveProjectOnline = useSaveProjectOnline();
  const navigate = useNavigate();

  const handleShowMore = useCallback(() => {
    navigate(Routes.module().withParams({ moduleId: BundledModuleId.ProjectManagement }));
    toggleMenu();
  }, [navigate, toggleMenu]);

  const handleExportProject = useCallback(() => {
    exportProject().catch((err) => logger.error('Export error: ', err));
    toggleMenu();
  }, [exportProject, toggleMenu]);

  return (
    <div className={clsx('d-flex flex-wrap align-items-start', Cls.menu)}>
      <ActionButton label={t('New_project')} icon={IconDefs.faFile} onClick={handleCreateNewProject} data-cy={'new-project'} />

      <ActionButton label={t('Import_project')} icon={IconDefs.faUpload} onClick={handleImportProject} data-cy={'import-project'} />

      <ActionButton label={t('Export_project')} icon={IconDefs.faDownload} onClick={handleExportProject} data-cy={'export-project'} />

      <ActionButton label={t('See_more')} icon={IconDefs.faGear} onClick={handleShowMore} data-cy={'see-more'} />

      {userAuthenticated && (
        <ActionButton label={t('Save_online')} icon={IconDefs.faPenAlt} disabled={!userAuthenticated} onClick={handleSaveProjectOnline} data-cy={'see-more'} />
      )}
    </div>
  );
}
