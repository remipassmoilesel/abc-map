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

import Cls from './RemoteProjectsModal.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { AbcProjectMetadata } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import { Modal } from 'react-bootstrap';
import { Errors } from '../../../../core/utils/Errors';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { useServices } from '../../../../core/useServices';
import { List } from './list/List';
import { DeleteConfirmation } from './delete-confirmation/DeleteConfirmation';
import { OpenConfirmation } from './open-confirmation/OpenConfirmation';

const logger = Logger.get('RemoteProjectModal.tsx');

export interface Props {
  onHide: () => void;
}

const t = prefixedTranslation('MapView:RemoteProjectsModal.');

function RemoteProjectsModal(props: Props) {
  const { onHide: handleHide } = props;
  const { project: projectService, toasts } = useServices();
  const [projects, setProjects] = useState<AbcProjectMetadata[]>([]);
  const [selected, setSelected] = useState<AbcProjectMetadata | undefined>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, showDeleteConfirmation] = useState(false);
  const [openConfirmation, showOpenConfirmation] = useState(false);

  const showList = !deleteConfirmation && !openConfirmation;

  // List projects on mount or after deletion
  const listProjects = useCallback(() => {
    projectService
      .listRemoteProjects()
      .then((projects) => setProjects(projects.reverse()))
      .catch((err) => logger.error('Cannot list projects: ', err));
  }, [projectService]);

  // List projects on mount
  useEffect(() => listProjects(), [listProjects]);

  // Selection
  const handleItemSelected = useCallback((project: AbcProjectMetadata) => setSelected(project), []);

  // Deletion
  const handleDeleteProject = useCallback((project: AbcProjectMetadata) => {
    setSelected(project);
    showDeleteConfirmation(true);
  }, []);

  const handleDeleteCanceled = useCallback(() => showDeleteConfirmation(false), []);

  const handleDeleteConfirmed = useCallback(() => {
    const id = selected?.id;
    if (!id) {
      toasts.genericError();
      return;
    }

    setLoading(true);

    projectService
      .deleteById(id)
      .then(() => {
        toasts.info(t('Project_deleted'));
        setSelected(undefined);
        showDeleteConfirmation(false);
        listProjects();
      })
      .catch((err) => {
        toasts.genericError(err);
        logger.error('Cannot delete project: ', err);
      })
      .finally(() => setLoading(false));
  }, [selected?.id, listProjects, projectService, toasts]);

  // Project opening
  const handleOpenProject = useCallback(() => {
    if (!selected) {
      return;
    }

    setSelected(selected);
    showOpenConfirmation(true);
  }, [selected]);

  const handleOpenCanceled = useCallback(() => {
    showOpenConfirmation(false);
    setMessage('');
  }, []);

  const handleOpenConfirmed = useCallback(
    (password: string) => {
      if (!selected) {
        logger.error('No project selected');
        return;
      }

      if (selected.containsCredentials && !password) {
        toasts.info(t('You_must_enter_a_password'));
        return;
      }

      setLoading(true);

      projectService
        .loadPrivateProject(selected.id, password)
        .then(() => {
          handleHide();
          toasts.info(t('Project_open'));
        })
        .catch((err) => {
          logger.error('Cannot open project: ', err);

          if (Errors.isWrongPassword(err) || Errors.isMissingPassword(err)) {
            setMessage(t('Incorrect_password'));
          } else {
            toasts.genericError(err);
          }
        })
        .finally(() => setLoading(false));
    },
    [handleHide, projectService, selected, toasts]
  );

  return (
    <Modal show={true} onHide={handleHide} backdrop={'static'} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('My_online_projects')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={Cls.modal}>
        {/* List of projects */}
        {showList && (
          <List
            projects={projects}
            selected={selected}
            onSelect={handleItemSelected}
            onDelete={handleDeleteProject}
            onOpen={handleOpenProject}
            onCancel={handleHide}
            disabled={loading || !selected}
          />
        )}

        {/* Delete confirmation */}
        {deleteConfirmation && selected && (
          <DeleteConfirmation project={selected} onConfirm={handleDeleteConfirmed} onCancel={handleDeleteCanceled} disabled={loading} />
        )}

        {/* Open confirmation */}
        {openConfirmation && selected && (
          <OpenConfirmation project={selected} onConfirm={handleOpenConfirmed} onCancel={handleOpenCanceled} disabled={loading} message={message} />
        )}
      </Modal.Body>
    </Modal>
  );
}

export default withTranslation()(RemoteProjectsModal);
