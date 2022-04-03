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

import Cls from './List.module.scss';
import { ProjectItem } from './ProjectItem';
import React from 'react';
import { AbcProjectMetadata, AbcProjectQuotas } from '@abc-map/shared';
import { prefixedTranslation } from '../../../../../i18n/i18n';

const t = prefixedTranslation('MapView:RemoteProjectsModal.');

interface Props {
  projects: AbcProjectMetadata[];
  quotas: AbcProjectQuotas | undefined;
  selected: AbcProjectMetadata | undefined;
  onSelect: (p: AbcProjectMetadata) => void;
  onDelete: (p: AbcProjectMetadata) => void;
  onCancel: () => void;
  onOpen: () => void;
  disabled: boolean;
}

export function List(props: Props) {
  const { projects, quotas, selected, onSelect, onDelete, onCancel, onOpen, disabled } = props;

  return (
    <div className={'d-flex flex-column h-100'}>
      <div className={Cls.projectList}>
        {/* List of projects */}
        {projects.map((pr) => {
          const isSelected = selected?.id === pr.id;
          return <ProjectItem key={pr.id} project={pr} selected={isSelected} onSelect={onSelect} onDelete={onDelete} />;
        })}

        {/* Message if list is empty */}
        {!projects.length && <div>{t('No_saved_project')}</div>}
      </div>

      {/* Count and quotas */}
      {quotas && (
        <div className={'mb-4'}>
          {t('x_projects_saved_on_y_projects_allowed', { currently: quotas.currently, allowed: quotas.allowed })}
          &nbsp;
          {quotas.currently >= quotas.allowed && <b>{t('It_is_full')}</b>}
        </div>
      )}

      <div className={'d-flex justify-content-end'}>
        <button onClick={onCancel} className={'btn btn-secondary mr-3'} data-cy={'cancel-button'}>
          {t('Cancel')}
        </button>
        <button onClick={onOpen} disabled={disabled} className={'btn btn-primary'} data-cy="open-project">
          {t('Open_project')}
        </button>
      </div>
    </div>
  );
}
