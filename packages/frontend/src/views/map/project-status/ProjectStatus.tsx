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

import React, { useCallback, useState } from 'react';
import { Logger } from '@abc-map/shared';
import EditProjectModal from './edit-project-modal/EditProjectModal';
import { prefixedTranslation } from '../../../i18n/i18n';
import { useAppSelector } from '../../../core/store/hooks';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import Cls from './ProjectStatus.module.scss';

const logger = Logger.get('ProjectStatus.tsx');

const t = prefixedTranslation('MapView:ProjectStatus.');

function ProjectStatus() {
  const [editModal, setEditModal] = useState(false);
  const { view, metadata } = useAppSelector((st) => st.project);

  const handleEditClick = useCallback(() => {
    setEditModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setEditModal(false);
  }, []);

  return (
    <div className={'control-block d-flex flex-column'}>
      {/* Project name */}
      <div className={Cls.name} data-cy="project-name">
        {metadata.name}
      </div>

      {/* Current projection */}
      <div>
        <span className={'badge bg-secondary'}>{t('Projection')}</span> {view.projection.name}
      </div>

      {/* Edit button and modal */}
      <div className={`control-item mt-3`}>
        <button onClick={handleEditClick} className={'btn btn-link'} data-cy="edit-project">
          <FaIcon icon={IconDefs.faPencilAlt} className={'mr-2'} /> {t('Edit')}
        </button>
      </div>

      <EditProjectModal visible={editModal} onClose={handleModalClose} />
    </div>
  );
}

export default ProjectStatus;
