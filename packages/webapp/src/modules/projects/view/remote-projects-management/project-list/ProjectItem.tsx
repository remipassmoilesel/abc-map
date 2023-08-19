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

import { AbcProjectMetadata } from '@abc-map/shared';
import { useCallback } from 'react';
import clsx from 'clsx';
import Cls from './ProjectItem.module.scss';
import { WithTooltip } from '../../../../../components/with-tooltip/WithTooltip';
import { FaIcon } from '../../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../../components/icon/IconDefs';
import { useTranslation } from 'react-i18next';

interface Props {
  project: AbcProjectMetadata;
  selected: boolean;
  onDelete: (project: AbcProjectMetadata) => void;
  onSelect: (project: AbcProjectMetadata) => void;
}

export function ProjectItem(props: Props) {
  const { project, selected, onDelete, onSelect } = props;
  const { t } = useTranslation('ProjectManagement');

  const handleSelect = useCallback(() => onSelect(project), [onSelect, project]);
  const handleDelete = useCallback(() => onDelete(project), [onDelete, project]);

  return (
    <div key={project.id} className={clsx(Cls.item, selected && Cls.selected)}>
      <div onClick={handleSelect} className={'flex-grow-1 d-flex align-items-center'} data-cy={'remote-project'}>
        {project.public && (
          <WithTooltip title={t('This_project_is_public')} placement={'top'}>
            <div>
              <FaIcon icon={IconDefs.faGlobeEurope} className={'mr-2'} />
            </div>
          </WithTooltip>
        )}

        {!project.public && (
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
