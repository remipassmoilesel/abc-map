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

import { useServices } from '../../../../../core/useServices';
import React, { useCallback, useRef, useState } from 'react';
import { CopyButton } from '../../../../../components/copy-button/CopyButton';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../core/store/hooks';
import { AbcProjectMetadata, Logger } from '@abc-map/shared';
import clsx from 'clsx';
import Cls from './ProjectOverview.module.scss';
import { FaIcon } from '../../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../../components/icon/IconDefs';
import { SharingCodesModal } from '../../../../../components/sharing-codes-modal/SharingCodesModal';

const logger = Logger.get('ProjectOverview.ts');

interface Props {
  project: AbcProjectMetadata | undefined;
  onOpen: (meta: AbcProjectMetadata) => void;
  onDownload: (meta: AbcProjectMetadata) => void;
  disabled: boolean;
  className?: string;
}

export function ProjectOverview(props: Props) {
  const { project, onOpen, onDownload, disabled, className } = props;
  const { t } = useTranslation('ProjectManagement');
  const loadedProject = useAppSelector((st) => st.project.metadata);
  const { project: projectService } = useServices();
  const shareLinkRef = useRef<HTMLInputElement>(null);

  const [sharingCodes, showSharingCodes] = useState(false);
  const handleToggleSharingCodes = useCallback(() => showSharingCodes(!sharingCodes), [sharingCodes]);

  const isCurrentProject = project?.id === loadedProject.id;
  const isProjectPublic = !!project?.public;
  const isProjectPrivate = !project?.public;

  const handleOpen = useCallback(() => {
    if (!project) {
      logger.error('No projet selected');
      return;
    }

    onOpen(project);
  }, [onOpen, project]);

  const handleDownload = useCallback(() => {
    if (!project) {
      logger.error('No projet selected');
      return;
    }

    onDownload(project);
  }, [onDownload, project]);

  return (
    <div className={className}>
      {project && (
        <>
          <h5>{project.name}</h5>

          {isCurrentProject && <div className={'badge bg-secondary mb-3'}>{t('This_project_is_open')}</div>}

          <div className={'mb-4'}>
            <FaIcon icon={isProjectPublic ? IconDefs.faEarthEurope : IconDefs.faLock} className={'me-2'} />
            {isProjectPublic && t('This_project_is_public')}
            {isProjectPrivate && t('This_project_is_private')}
          </div>

          {isProjectPublic && (
            <>
              <div className={'mb-2'}>{t('Share_link')}:</div>
              <div className={'d-flex align-items-center mb-4'}>
                <input
                  type={'text'}
                  value={projectService.getPublicLink(project.id)}
                  ref={shareLinkRef}
                  readOnly={true}
                  className={clsx('form-control me-3', Cls.copyInput)}
                  data-cy={'public-url'}
                />
                <CopyButton inputRef={shareLinkRef} className={'me-3'} />

                <button onClick={handleToggleSharingCodes} className={'d-flex align-items-center btn btn-outline-primary'}>
                  {t('See_more')} <FaIcon icon={IconDefs.faQrcode} className={'ms-2'} />
                </button>
              </div>
            </>
          )}

          <div className={'d-flex'}>
            <button onClick={handleDownload} disabled={disabled} className={'btn btn-outline-primary me-2'} data-cy="download-project">
              {t('Download_project')} <FaIcon icon={IconDefs.faDownload} className={'ms-2'} />
            </button>

            <button onClick={handleOpen} disabled={disabled || isCurrentProject} className={'btn btn-primary me-2'} data-cy="open-project">
              {t('Open_project')} <FaIcon icon={IconDefs.faFolder} className={'ms-2'} />
            </button>
          </div>

          {sharingCodes && <SharingCodesModal project={project} onClose={handleToggleSharingCodes} />}
        </>
      )}
    </div>
  );
}
