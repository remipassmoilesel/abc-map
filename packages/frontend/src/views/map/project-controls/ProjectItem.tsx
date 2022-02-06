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

import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import React, { useCallback } from 'react';
import { AbcProjectMetadata } from '@abc-map/shared';
import { prefixedTranslation } from '../../../i18n/i18n';
import clsx from 'clsx';
import Cls from './ProjectItem.module.scss';

interface Props {
  project: AbcProjectMetadata;
  selected: boolean;
  onDelete: (project: AbcProjectMetadata) => void;
  onSelect: (project: AbcProjectMetadata) => void;
}

const t = prefixedTranslation('MapView:RemoteProjectsModal.');

export function ProjectItem(props: Props) {
  const { project, selected, onDelete, onSelect } = props;

  const handleSelect = useCallback(() => onSelect(project), [onSelect, project]);
  const handleDelete = useCallback(() => onDelete(project), [onDelete, project]);

  return (
    <div key={project.id} className={clsx(Cls.item, selected && Cls.selected)}>
      <div onClick={handleSelect} className={'flex-grow-1 d-flex align-items-center'} data-cy={'remote-project'}>
        {project.name}
        {project.containsCredentials && <FaIcon icon={IconDefs.faLock} className={'ml-2'} title={t('This_project_is_password_protected')} />}
        {project.public && <FaIcon icon={IconDefs.faGlobeEurope} className={'ml-2'} title={t('This_project_is_public')} />}
      </div>

      <div onClick={handleDelete} data-cy={'delete-project'}>
        <FaIcon icon={IconDefs.faTrash} className={'mx-2'} title={t('Delete_project')} />
      </div>
    </div>
  );
}
