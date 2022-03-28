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

import { FaIcon } from '../../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../../components/icon/IconDefs';
import React, { useCallback } from 'react';
import { AbcProjectMetadata } from '@abc-map/shared';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import clsx from 'clsx';
import Cls from './ProjectItem.module.scss';
import { WithTooltip } from '../../../../../components/with-tooltip/WithTooltip';

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
        {project.containsCredentials && (
          <WithTooltip title={t('This_project_is_password_protected')} placement={'top'}>
            <div>
              <FaIcon icon={IconDefs.faLock} className={'mr-2'} />
            </div>
          </WithTooltip>
        )}

        {project.public && (
          <WithTooltip title={t('This_project_is_public')} placement={'top'}>
            <div>
              <FaIcon icon={IconDefs.faGlobeEurope} className={'mr-2'} />
            </div>
          </WithTooltip>
        )}

        {!project.containsCredentials && !project.public && (
          <WithTooltip title={t('This_project_is_private')} placement={'top'}>
            <div>
              <FaIcon icon={IconDefs.faFile} className={'mr-2'} />
            </div>
          </WithTooltip>
        )}

        {project.name}
      </div>

      <div onClick={handleDelete} data-cy={'delete-project'}>
        <WithTooltip title={t('Delete_project')} placement={'top'}>
          <div>
            <FaIcon icon={IconDefs.faTrash} className={'mx-2'} />
          </div>
        </WithTooltip>
      </div>
    </div>
  );
}
