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

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { AbcProjectMetadata } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import { Modal } from 'react-bootstrap';
import { Errors } from '../../../core/utils/Errors';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './RemoteProjectsModal.module.scss';
import { OperationStatus } from '../../../core/ui/typings';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import { useServices } from '../../../core/useServices';
import { ProjectItem } from './ProjectItem';

const logger = Logger.get('RemoteProjectModal.tsx');

export interface Props {
  onHide: () => void;
}

const t = prefixedTranslation('MapView:RemoteProjectsModal.');

function RemoteProjectsModal(props: Props) {
  const { onHide } = props;
  const { project: projectService, toasts } = useServices();
  const [projects, setProjects] = useState<AbcProjectMetadata[]>([]);
  const [selected, setSelected] = useState<AbcProjectMetadata | undefined>();
  const [passwordValue, setPasswordValue] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<AbcProjectMetadata | undefined>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const showCredentials = !deleteConfirmation && selected && selected.containsCredentials;
  const showButtons = !deleteConfirmation;
  const showModificationsWarning = !deleteConfirmation && selected;

  const listProjects = useCallback(() => {
    projectService
      .listRemoteProjects()
      .then((projects) => setProjects(projects.reverse()))
      .catch((err) => logger.error('Cannot list projects: ', err));
  }, [projectService]);

  useEffect(() => {
    listProjects();
  }, [listProjects]);

  const handlePasswordInput = useCallback((ev: ChangeEvent<HTMLInputElement>) => setPasswordValue(ev.target.value), []);

  const handleItemSelected = useCallback((project: AbcProjectMetadata) => setSelected(project), []);

  const handleDeleteProject = useCallback((project: AbcProjectMetadata) => setDeleteConfirmation(project), []);

  const handleDeleteCanceled = useCallback(() => setDeleteConfirmation(undefined), []);

  const handleDeleteConfirmed = useCallback(() => {
    const id = deleteConfirmation?.id;
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
        setDeleteConfirmation(undefined);
        listProjects();
      })
      .catch((err) => {
        toasts.genericError(err);
        logger.error('Cannot delete project: ', err);
      })
      .finally(() => setLoading(false));
  }, [deleteConfirmation?.id, listProjects, projectService, toasts]);

  const handleOpenProject = useCallback(() => {
    setLoading(true);

    const loadProject = async () => {
      if (!selected) {
        toasts.info(t('You_must_select_a_project'));
        return OperationStatus.Interrupted;
      }

      if (selected.containsCredentials && !passwordValue) {
        toasts.info(t('You_must_enter_a_password'));
        return OperationStatus.Interrupted;
      }

      await projectService.loadPrivateProject(selected.id, passwordValue);
      toasts.info(t('Project_open'));
      onHide();

      return OperationStatus.Succeed;
    };

    loadProject()
      .catch((err) => {
        logger.error('Cannot open project: ', err);

        if (Errors.isWrongPassword(err) || Errors.isMissingPassword(err)) {
          setMessage(t('Incorrect_password'));
        } else {
          toasts.genericError(err);
        }
      })
      .finally(() => setLoading(false));
  }, [onHide, passwordValue, projectService, selected, toasts]);

  return (
    <Modal show={true} size={'lg'} onHide={onHide} backdrop={'static'} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Projects_saved')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* List of projects */}
        <div className={`${Cls.projectList} mb-3`}>
          {projects.map((pr) => {
            const isSelected = selected?.id === pr.id;
            return <ProjectItem key={pr.id} project={pr} selected={isSelected} onSelect={handleItemSelected} onDelete={handleDeleteProject} />;
          })}
          {!projects.length && <div>{t('No_saved_project')}</div>}
        </div>

        {showModificationsWarning && (
          <div className={'alert alert-warning d-flex align-items-center justify-content-center mb-3'}>
            <FaIcon icon={IconDefs.faExclamationTriangle} className={'mr-2'} /> {t('Current_changes_will_be_lost')}
          </div>
        )}

        {/* Delete confirmation */}
        {deleteConfirmation && (
          <div className={`alert alert-danger mb-3 p-2`}>
            <div className={'mb-2 text-center'}>{t('Are_you_sure')} </div>
            <div className={'fw-bold text-center'}>{deleteConfirmation.name}</div>
            <div className={'d-flex justify-content-center align-items-center mt-4'}>
              <button onClick={handleDeleteCanceled} className={'btn btn-secondary mr-2'} disabled={loading}>
                {t('Do_not_delete')}
              </button>
              <button onClick={handleDeleteConfirmed} className={'btn btn-danger'} disabled={loading} data-cy={'confirm-deletion'}>
                {t('Delete_definitely')}
              </button>
            </div>
          </div>
        )}

        {/* Password prompt, if project is protected */}
        {showCredentials && (
          <div className={Cls.passwordInput}>
            <div>{t('This_project_is_protected_by_a_password')}:</div>
            <input
              type={'password'}
              onInput={handlePasswordInput}
              value={passwordValue}
              placeholder={t('Password_of_project')}
              className={'form-control'}
              data-cy={'project-password'}
            />
          </div>
        )}

        {/* Confirmation buttons */}
        {showButtons && (
          <>
            {/* Message if any */}
            {message && <div className={'my-3 d-flex justify-content-end'}>{message}</div>}

            <div className={'d-flex justify-content-end'}>
              <button onClick={onHide} disabled={loading} className={'btn btn-secondary mr-3'} data-cy={'cancel-button'}>
                {t('Cancel')}
              </button>
              <button onClick={handleOpenProject} disabled={!selected || loading} className={'btn btn-primary'} data-cy="open-project-confirm">
                {t('Open_project')}
              </button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default withTranslation()(RemoteProjectsModal);
