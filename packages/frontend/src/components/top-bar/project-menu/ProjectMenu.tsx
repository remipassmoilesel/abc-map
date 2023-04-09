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

import React, { useCallback } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Logger } from '@abc-map/shared';
import Cls from './ProjectMenu.module.scss';
import { FaIcon } from '../../icon/FaIcon';
import { IconDefs } from '../../icon/IconDefs';
import { useIsUserAuthenticated } from '../../../core/authentication/useIsUserAuthenticated';
import { useTranslation } from 'react-i18next';
import { useCreateNewProject } from '../../../core/project/useCreateNewProject';
import { useExportProject } from '../../../core/project/useExportProject';
import { useImportProject } from '../../../core/project/useImportProject';
import { useSaveProjectOnline } from '../../../core/project/useSaveProjectOnline';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../../routes';
import { LocalModuleId } from '../../../modules/LocalModuleId';
import { useServices } from '../../../core/useServices';

const logger = Logger.get('ProjectMenu.tsx');

export function ProjectMenu() {
  const { t } = useTranslation('ProjectMenu');
  const { modals } = useServices();
  const userAuthenticated = useIsUserAuthenticated();
  const handleCreateNewProject = useCreateNewProject();
  const handleImportProject = useImportProject();
  const handleExportProject = useExportProject();
  const handleSaveProjectOnline = useSaveProjectOnline();
  const navigate = useNavigate();

  const handleShowMore = useCallback(() => {
    navigate(Routes.module().withParams({ moduleId: LocalModuleId.ProjectManagement }));
  }, [navigate]);

  const handleLogin = useCallback(() => {
    modals.login().catch((err) => logger.error('Modal error: ', err));
  }, [modals]);

  return (
    <Dropdown className={Cls.projectMenu} align={'end'} data-cy={'project-menu'}>
      {/* Menu icon */}
      <Dropdown.Toggle variant="light">
        <FaIcon icon={IconDefs.faFileImport} className={Cls.toggleIcon} />
      </Dropdown.Toggle>

      {/* Menu items */}
      <Dropdown.Menu className={Cls.dropdown}>
        <Dropdown.Item onClick={handleCreateNewProject} data-cy={'new-project'}>
          <FaIcon icon={IconDefs.faFile} className={'mr-2'} /> {t('New_project')}
        </Dropdown.Item>

        <Dropdown.Item onClick={handleImportProject} data-cy={'import-project'}>
          <FaIcon icon={IconDefs.faUpload} className={'mr-2'} />
          {t('Import_project')}
        </Dropdown.Item>

        <Dropdown.Item onClick={handleExportProject} data-cy={'export-project'}>
          <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
          {t('Export_project')}
        </Dropdown.Item>

        <Dropdown.Divider />

        {!userAuthenticated && (
          <Dropdown.Item onClick={handleLogin} className={'text-wrap mb-2'}>
            {t('You_must_login_to_save_online')}
          </Dropdown.Item>
        )}

        <Dropdown.Item onClick={handleSaveProjectOnline} disabled={!userAuthenticated}>
          <FaIcon icon={IconDefs.faPenAlt} className={'mr-2'} />
          {t('Save_online')}
        </Dropdown.Item>

        <Dropdown.Item onClick={handleShowMore} disabled={!userAuthenticated}>
          <FaIcon icon={IconDefs.faGlobeEurope} className={'mr-2'} />
          {t('My_projects')}
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item onClick={handleShowMore} data-cy={'see-more'}>
          {t('See_more')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
