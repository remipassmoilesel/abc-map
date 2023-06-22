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

import { ProjectList } from './project-list/ProjectList';
import { ProjectOverview } from './project-overview/ProjectOverview';
import React, { useCallback, useEffect, useState } from 'react';
import { useServices } from '../../../../core/useServices';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../core/store/hooks';
import { AbcProjectMetadata, AbcProjectQuotas, Logger } from '@abc-map/shared';
import { ModalStatus } from '../../../../core/ui/typings';
import clsx from 'clsx';
import { FileIO } from '../../../../core/utils/FileIO';

const logger = Logger.get('RemoteProjectsList.tsx');

interface Props {
  className: string;
}

export function RemoteProjectsManagement(props: Props) {
  const { className } = props;
  const { project: projectService, modals, toasts } = useServices();
  const { t } = useTranslation('ProjectManagement');
  const [projects, setProjects] = useState<AbcProjectMetadata[]>([]);
  const [quotas, setQuotas] = useState<AbcProjectQuotas | undefined>();

  const currectProject = useAppSelector((st) => st.project.metadata);
  const [selected, setSelected] = useState<AbcProjectMetadata | undefined>(currectProject);
  const [loading, setLoading] = useState(false);

  // List projects on mount or after deletion
  const listProjects = useCallback(() => {
    Promise.all([projectService.listRemoteProjects(), projectService.getQuotas()])
      .then(([projects, quotas]) => {
        setProjects(projects.reverse());
        setQuotas(quotas);
      })
      .catch((err) => logger.error('Cannot list projects: ', err));
  }, [projectService]);

  // List projects on mount and on save
  const lastSaveDate = useAppSelector((st) => st.project.lastSaveOnline);
  useEffect(() => listProjects(), [listProjects, lastSaveDate]);

  // Selection
  const handleItemSelected = useCallback((project: AbcProjectMetadata) => setSelected(project), []);

  // Deletion
  const handleDeleteProject = useCallback(
    (project: AbcProjectMetadata) => {
      setSelected(project);

      modals
        .confirmation(t('Delete_project'), t('Are_you_sure_?_This_project_will_be_permanently_lost', { projectName: project.name }))
        .then((status) => {
          if (ModalStatus.Canceled === status) {
            return;
          }

          setLoading(true);

          return projectService
            .deleteById(project.id)
            .then<unknown>(() => {
              toasts.info(t('Project_deleted'));

              // If this is the current project, we create a new one and we list projects
              if (currectProject.name === project.name) {
                return Promise.all([projectService.newProject(), listProjects()]);
              } else {
                return listProjects();
              }
            })
            .finally(() => {
              setLoading(false);
              setSelected(undefined);
            });
        })
        .catch((err) => {
          logger.error('Deletion error: ', err);
          toasts.genericError(err);
        });
    },
    [currectProject.name, listProjects, modals, projectService, t, toasts]
  );

  const handleOpenProject = useCallback(
    (project: AbcProjectMetadata) => {
      modals
        .modificationsLostConfirmation()
        .then((status) => {
          if (ModalStatus.Canceled === status) {
            return;
          }

          setLoading(true);
          return projectService
            .loadRemotePrivateProject(project.id)
            .then(() => {
              toasts.info(t('Project_open'));
            })
            .finally(() => setLoading(false));
        })
        .catch((err) => {
          logger.error('Project open error: ', err);
          toasts.genericError(err);
        });
    },
    [modals, projectService, t, toasts]
  );

  const handleDownloadProject = useCallback(
    (project: AbcProjectMetadata) => {
      setLoading(true);
      return projectService
        .findRemoteById(project.id)
        .then((blob) => {
          if (!blob) {
            throw new Error('Project not found !');
          }

          FileIO.downloadBlob(blob, `${project.name}.abm2`);
        })
        .catch((err) => {
          logger.error('Project download error: ', err);
          toasts.genericError(err);
        })
        .finally(() => setLoading(false));
    },
    [projectService, toasts]
  );

  return (
    <div className={clsx('d-flex flex-wrap', className)}>
      <ProjectList projects={projects} quotas={quotas} selected={selected} onSelect={handleItemSelected} onDelete={handleDeleteProject} />

      <ProjectOverview
        className={'flex-grow-1 ms-4 mt-4'}
        project={selected}
        onOpen={handleOpenProject}
        onDownload={handleDownloadProject}
        disabled={loading || !selected}
      />
    </div>
  );
}
